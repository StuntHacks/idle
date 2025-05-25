import { UI } from "../UI";
import { Wave, WaveColor, WaveParticleInfo } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private whichWave: WaveParticleInfo;
    private particles: WaveParticleInfo[] = [];
    private all: WaveParticleInfo;
    private type?: "thick" | "triple";
    private delay: number = 1000;
    private lastClick: number = 0;
    private surface: HTMLDivElement;

    constructor() {
        super();
    }

    ripple(x: number, strength: number = 120, speed: number = 10, decay: number = 0.05) {
        this.waves.forEach(wave => { wave.ripple(x, strength, speed, decay) });
    }

    connectedCallback() {
        const amount = parseInt(this.parentElement.getAttribute("data-fields"));
        const offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        let width = 3;

        const getNextDrop = (): number => {
            if (this.all) {
                if (Math.random() < 0.1) {
                    return -1;
                }
            }

            return Math.floor(Math.random() * this.particles.length);
        }

        const handleClick = (timestamp: number) => {
            let rect = this.surface.getBoundingClientRect();
            if (UI.mouseDown && UI.mouseY >= rect.y && UI.mouseY <= rect.bottom) {
                let now = performance.now();
                let data = {
                    x: UI.mouseX,
                    y: offset,
                    particle: undefined as WaveParticleInfo
                };
                if ((now - this.lastClick) < this.delay) {
                    window.requestAnimationFrame(handleClick);
                    return;
                }
                this.lastClick = now;

                if (this.type === "triple") {
                    data.particle = this.particles[0];
                    for (let wave of this.waves) {
                        wave.ripple(data.x, 160);
                    }
                } else {
                    let drop = getNextDrop();

                    if (drop === -1) {
                        data.particle = this.all;
                        for (let wave of this.waves) {
                            wave.ripple(data.x, 160);
                        }
                    } else {
                        data.particle = this.particles[drop];
                        this.waves[drop].ripple(data.x, 160);
                    }
                }

                this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { x: data.x, y: data.y, particle: data.particle } }));
            }
            window.requestAnimationFrame(handleClick);
        }

        this.surface = this.getElementsByClassName("field-surface")[0] as HTMLDivElement;
        this.surface.style.top = (offset - 40) + "px";

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

        window.requestAnimationFrame(handleClick);

        (this.getElementsByClassName("field-label")[0] as HTMLDivElement).style.top = (offset - 60) + "px";

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

        this.type = this.getAttribute("field-type") as "thick" | "triple" | null;

        if (this.type === "thick") {
            width = 20;
        } else if (this.type === "triple") {
            copies = 3;
        }

        let fields = this.getElementsByClassName("field");

        for (let i = 0; i < fields.length; i += copies) {
            let field = fields[i];
            let p = {
                type: field.getAttribute("data-type") || this.getAttribute("type"),
                flavor: field.getAttribute("data-flavor") || this.getAttribute("flavor"),
                color: field.getAttribute("data-color") || this.getAttribute("color"),
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
                    offset: offset,
                    particle: p,
                }));
            }
        }
    }
}

export interface RippleEvent {
    x: number;
    y: number;
    particle: WaveParticleInfo;
}
