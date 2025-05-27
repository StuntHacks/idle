import { UI } from "../UI";
import { Wave, WaveParticleInfo } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private particles: WaveParticleInfo[] = [];
    private all: WaveParticleInfo;
    private type?: "thick" | "triple";
    private delay: number = 1000;
    private lastClick: number = 0;
    private surface: HTMLDivElement;
    private tabContainer: HTMLElement;
    private allCounter = 0;

    constructor() {
        super();
    }

    ripple(x: number, strength: number = 120, speed: number = 10, decay: number = 0.05) {
        this.waves.forEach(wave => { wave.ripple(x, strength, speed, decay) });
    }

    connectedCallback() {
        this.tabContainer = this.closest("system-tab") as HTMLElement;

        const amount = parseInt(this.parentElement.getAttribute("data-fields"));
        this.surface = this.getElementsByClassName("field-surface")[0] as HTMLDivElement;
        let rect = this.surface.getBoundingClientRect();
        const offset = rect.y + (rect.height / 2) - 130;
        let width = 3;

        const getNextDrop = (): number => {
            if (this.all && this.allCounter > 3) {
                if (Math.random() < 0.1) {
                    this.allCounter = 0;
                    return -1;
                }
            }

            return Math.floor(Math.random() * this.particles.length);
        }

        const handleClick = (timestamp: number) => {
            let rect = this.surface.getBoundingClientRect();

            if (UI.mouseDown && UI.mouseY >= rect.y && UI.mouseY <= rect.bottom) {
                if (this.tabContainer.querySelector(".tab.active") === null) {
                    let now = performance.now();
                    let data = {
                        x: UI.mouseX,
                        y: offset + 100,
                        particle: undefined as WaveParticleInfo
                    };
                    if ((now - this.lastClick) < this.delay) {
                        window.requestAnimationFrame(handleClick);
                        return;
                    }
                    this.lastClick = now;
                    this.allCounter++;

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
            }
            window.requestAnimationFrame(handleClick);
        }

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
