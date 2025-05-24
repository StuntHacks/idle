import { Wave, WaveColor, WaveParticleInfo } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private whichWave: WaveParticleInfo;
    private particles: WaveParticleInfo[] = [];
    private all: WaveParticleInfo;
    private random: boolean;
    private type?: "thick" | "triple";
    private delay: number = 1000;
    private lastClick: number = 0;

    constructor() {
        super();
    }

    ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay) });
    }

    connectedCallback() {
        const amount = parseInt(this.parentElement.getAttribute("data-fields"));
        const offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        (this.getElementsByClassName("field-label")[0] as HTMLDivElement).style.top = (offset - 60) + "px";
        let width = 3;
        this.random = this.getAttribute("random") === "true";
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

        const getNextDrop = (): WaveParticleInfo => {
            if (this.all) {
                if (Math.random() < 0.1) {
                    return this.all;
                }
            }

            return this.particles[Math.floor(Math.random() * this.particles.length)];
        }

        const handleRipple = (x: number, manual: boolean, particle: WaveParticleInfo, index: number) => {
            if (!manual) {
                return true;
            }
            
            let now = performance.now();
            if ((now - this.lastClick) < this.delay) {
                return false;
            }

            if (this.type === "triple") {
                if (index === (this.particles.length * 3) - 1) {
                    this.lastClick = now;
                    this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { x, y: offset, manual, particle } }));
                }

                return true;
            }

            if (index === this.particles.length - 1) {
                this.lastClick = now;
            }

            if (this.random) {
                if (index === 0) {
                    this.whichWave = getNextDrop();
                    this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { x, y: offset, manual, particle: this.whichWave } }));
                }

                if (JSON.stringify(particle) === JSON.stringify(this.whichWave) || this.whichWave.all) {
                    return true;
                }

                return false;
            }

            this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { x, y: offset, manual, particle } }));
            return true;
        };

        let copies = 1;

        this.type = this.getAttribute("type") as "thick" | "triple" | null;
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
                    rippleCallback: handleRipple,
                    particle: p,
                    index: i + j,
                }));
            }
        }
    }
}

export interface RippleEvent {
    x: number;
    y: number;
    manual: boolean;
    particle: WaveParticleInfo;
}
