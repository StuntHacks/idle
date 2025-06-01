import { Currencies } from "game_logic/currencies/Currencies";
import { Quantum } from "game_logic/systems/quantum/Quantum";
import { UI } from "../UI";
import { Wave, WaveParticleInfo } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private particles: WaveParticleInfo[] = [];
    private all: WaveParticleInfo;
    private type?: string | null;
    private delay: number = 1000;
    private lastClick: number = 0;
    private offset: number = 0;
    private surface: HTMLDivElement;
    private tabContainer: HTMLElement;
    private allCounter: number = 0;
    private allChance: number = 0.1;

    constructor() {
        super();
    }

    ripplePassive(x: number) {
        this.waves.forEach(wave => { wave.ripple(x, 20, 10, 0.05) });
    }

    ripple(x: number, index: number) {
        if (this.type === "triple" || index === -1) {
            for (let wave of this.waves) {
                wave.ripple(x, 160);
            }
        } else {
            this.waves[index].ripple(x, 160);
        }
    }

    getParticle(): [WaveParticleInfo, number] {
        if (this.all && this.allCounter > 3) {
            if (Math.random() < this.allChance) {
                this.allCounter = 0;
                return [this.all, -1];
            }
        }

        this.allCounter++;
        const index = Math.floor(Math.random() * this.particles.length);

        return [this.particles[index], index];
    }

    private handleClick = (timestamp: number, delay: number = undefined) => {
        let rect = this.surface.getBoundingClientRect();

        if ((UI.mouseDown && UI.mouseY >= rect.y && UI.mouseY <= rect.bottom)) {
            if (this.tabContainer.querySelector(".tab.active") === null) {
                let now = performance.now();
                let d = delay ? delay : this.delay;
                if ((now - this.lastClick) < d) {
                    window.requestAnimationFrame(this.handleClick);
                    return;
                }
                this.lastClick = now;

                const [particle, index] = this.getParticle();
                // todo: consolidate this
                const hash = Currencies.getFromQuantumField(particle);
                const amount = Quantum.getParticleAmount(particle);

                if (particle.all && particle.type === "quark") {
                    const hashRed = hash.replace("rgb", "red");
                    Currencies.gain(hashRed, amount);
                    const hashGreen = hashRed.replace("red", "green");
                    Currencies.gain(hashGreen, amount);
                    const hashBlue = hashRed.replace("red", "blue");
                    Currencies.gain(hashBlue, amount);
                    Currencies.spawnGainElement(hash, amount, UI.mouseX - (Math.floor(Math.random() * 20) - 10), UI.mouseY, true);
                } else {
                    Currencies.gain(hash, amount);
                    Currencies.spawnGainElement(hash, amount, UI.mouseX - (Math.floor(Math.random() * 20) - 10), UI.mouseY, true);
                }

                this.ripple(UI.mouseX, index);
            }
        }
        window.requestAnimationFrame(this.handleClick);
    }

    connectedCallback() {
        this.handleClick = this.handleClick.bind(this);
        this.tabContainer = this.closest("system-tab") as HTMLElement;
        let width = 3;

        this.surface = this.getElementsByClassName("field-surface")[0] as HTMLDivElement;

        if (this.surface) {
            let rect = this.surface.getBoundingClientRect();
            this.offset = rect.y + (rect.height / 2) - 90;

            this.surface.addEventListener("mouseenter", (e: MouseEvent) => {
                for (let wave of this.waves) {
                    if (!wave.isHovered()) {
                        wave.setHovered(true);
                        wave.ripple(e.clientX, 20, 10, 0.05);
                    }
                }
            });
            this.surface.addEventListener("mouseleave", (e: MouseEvent) => {
                for (let wave of this.waves) {
                    wave.setHovered(false);
                }
            });

            window.requestAnimationFrame(this.handleClick);
        }

        this.delay = parseInt(this.getAttribute("delay"));
        this.type = this.getAttribute("type") as "thick" | "triple" | null;

        if (this.getAttribute("all") === "true") {
            this.all = {
                type: this.getAttribute("all-type"),
                flavor: this.getAttribute("all-flavor"),
                color: this.getAttribute("all-color"),
                all: true,
            }
        }

        let copies = 1;

        this.type = this.getAttribute("field-type") as string | null;

        if (this.type) {
            if (this.type.includes("thick")) {
                width = 12;
            }

            if (this.type.includes("triple")) {
                copies = 3;
            }
        }

        let fields = this.getElementsByClassName("field");
        let contained = this.hasAttribute("contained");

        for (let i = 0; i < fields.length; i += copies) {
            let field = fields[i];
            let p = {
                type: field.getAttribute("data-type") || this.getAttribute("type"),
                flavor: field.getAttribute("data-flavor") || this.getAttribute("flavor"),
                color: field.getAttribute("data-color") || this.getAttribute("color"),
                all: false,
            };

            this.particles.push(p);
            for (let j = 0; j < copies; j++) {
                this.canvases.push(document.createElement("canvas"));
                this.appendChild(this.canvases[i + j]);
                this.waves.push(new Wave(this.canvases[i + j], this.parentElement, {
                    amplitude: 20,
                    frequency: 1,
                    speed: 0.02,
                    lineWidth: width,
                    color: {
                        start: field.getAttribute("data-color-start") || this.getAttribute("color-start"),
                        end: field.getAttribute("data-color-end") || this.getAttribute("color-end"),
                        glow: field.getAttribute("data-color-glow") || this.getAttribute("color-glow"),
                        hover: field.getAttribute("data-color-hover") || this.getAttribute("color-hover") || "#ffffff",
                    },
                    pointCount: 10,
                    offset: this.offset,
                    particle: p,
                }, contained));
            }
        }
    }
}
