import { Wave, WaveColor } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private colors: WaveColor[] = [];
    private whichWave: string;

    constructor() {
        super();
    }

    ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05, max: number = 1, ttl: number | undefined = undefined) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay, max, ttl) });
    }

    connectedCallback() {
        let offset = ((this.parentElement.clientHeight / 6) / 2) * parseInt(this.getAttribute("index"));

        if (this.getAttribute("type") === "rainbow") {
            const getNextDrop = (): string => ["red", "green", "blue", "all"][Math.floor(Math.random() * 4)]

            const handleRipple = (manual: boolean, id: string) => {
                if (id === "blue") {
                    this.whichWave = getNextDrop();
                }
                
                if (!manual || this.whichWave === "all" || id === this.whichWave) {
                    this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { manual, id } }));
                    return true;
                }

                return false;
            }

            this.canvases.push(document.createElement("canvas"));
            this.canvases.push(document.createElement("canvas"));
            this.canvases.push(document.createElement("canvas"));
            this.canvases.forEach(canvas => {
                this.appendChild(canvas);
            });

            this.colors = [
                {
                    start: "#0000ffBB",
                    end: "#00ffffBB",
                    glow: "#00ffffBB",
                    hover: "#0000ff",
                },
                {
                    start: "#00ff00BB",
                    end: "#00ffffBB",
                    glow: "#00ff00BB",
                    hover: "#00ff00",
                },
                {
                    start: "#ff0000BB",
                    end: "#ff00ffBB",
                    glow: "#ff00ffBB",
                    hover: "#ff0000",
                },
            ];

            let ids = ["blue", "green", "red"];

            this.colors.forEach((color, index) => {
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
                    rippleCallback: handleRipple,
                    id: ids[index],
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
                    return true;
                }
            }));
        }
    }
}

export interface RippleEvent {
    manual: boolean;
    id?: string;
}
