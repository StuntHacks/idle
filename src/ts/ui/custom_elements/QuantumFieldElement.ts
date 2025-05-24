import { Wave, WaveColor, WaveParticleInfo } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private whichWave: WaveParticleInfo;
    private particles: WaveParticleInfo[] = [];
    private all: WaveParticleInfo;
    private random: boolean;

    constructor() {
        super();
    }

    ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05, max: number = 1) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay, max) });
    }

    connectedCallback() {
        const amount = parseInt(this.parentElement.getAttribute("data-fields"));
        const offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        (this.getElementsByClassName("field-label")[0] as HTMLDivElement).style.top = (offset - 60) + "px";
        let width = 3;
        this.random = this.getAttribute("random") === "true";

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

        const handleRipple = (x: number, manual: boolean, particle: WaveParticleInfo) => {
            if (!manual) {
                return true;
            }

            if (this.random) {
                if (JSON.stringify(particle) === JSON.stringify(this.particles[0])) {
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

        if (this.getAttribute("type") === "thick") {
            width = 20;
        }

        let fields = this.getElementsByClassName("field");

        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let p = {
                type: field.getAttribute("data-type"),
                flavor: field.getAttribute("data-flavor"),
                color: field.getAttribute("data-color"),
            };

            this.particles.push(p);

            this.canvases.push(document.createElement("canvas"));
            this.appendChild(this.canvases[i]);
            this.waves.push(new Wave(this.canvases[i], this.parentElement, {
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
            }));
        }
    }
}

export interface RippleEvent {
    x: number;
    y: number;
    manual: boolean;
    particle: WaveParticleInfo;
}
