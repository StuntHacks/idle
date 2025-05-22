import { Wave, WaveColor } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private colors: WaveColor[] = [];

    constructor() {
        super();
    }

    ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05, max: number = 1, ttl: number | undefined = undefined) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay, max, ttl) });
    }

    connectedCallback() {
        let offset = ((this.parentElement.clientHeight / 6) / 2) * parseInt(this.getAttribute("index"));

        if (this.getAttribute("type") === "rainbow") {

            this.canvases.push(document.createElement("canvas"));
            this.canvases.push(document.createElement("canvas"));
            this.canvases.push(document.createElement("canvas"));
            this.canvases.forEach(canvas => {
                this.appendChild(canvas);
            });

            this.colors = [
                {
                    start: "#0000ff",
                    end: "#00ffff",
                    glow: "#00ffff",
                    hover: "#ffffff",
                },
                {
                    start: "#00ff00",
                    end: "#00ffff",
                    glow: "#00ff00",
                    hover: "#ffffff",
                },
                {
                    start: "#ff0000",
                    end: "#ff00ff",
                    glow: "#ff00ff",
                    hover: "#ffffff",
                },
            ];

            this.colors.forEach((color, index) => {
                console.log(color)
                this.waves.push(new Wave(this.canvases[index], this.parentElement, {
                    amplitude: 10,
                    frequency: 1,
                    speed: 0.02,
                    lineWidth: 3,
                    color: {
                        start: color.start,
                        end: color.end,
                        glow: color.glow,
                        hover: color.hover,
                    },
                    pointCount: 10,
                    offset: 100 * parseInt(this.getAttribute("index")),
                    rippleCallback: (manual: boolean) => {
                        this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { manual } }));
                    }
                }));
            });
        } else {
            this.canvases.push(document.createElement("canvas"));
            this.appendChild(this.canvases[0]);

            this.waves.push(new Wave(this.canvases[0], this.parentElement, {
                amplitude: 10,
                frequency: 1,
                speed: 0.02,
                lineWidth: 3,
                color: {
                    start: this.getAttribute("color-start"),
                    end: this.getAttribute("color-end"),
                    glow: this.getAttribute("color-glow"),
                    hover: this.getAttribute("color-hover") || "#ffffff",
                },
                pointCount: 10,
                offset: 100 * parseInt(this.getAttribute("index")),
                rippleCallback: (manual: boolean) => {
                    this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { manual } }));
                }
            }));
        }
    }
}

export interface RippleEvent {
    manual: boolean;
}
