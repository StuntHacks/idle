import { Wave, WaveColor } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private canvases: HTMLCanvasElement[] = [];
    private colors: WaveColor[] = [];
    private whichWave: string;
    private ids: string[];

    constructor() {
        super();
    }

    ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05, max: number = 1, ttl: number | undefined = undefined) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay, max, ttl) });
    }

    connectedCallback() {
        let amount = parseInt(this.parentElement.getAttribute("data-fields"));
        let offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        let handleRipple;

        if (this.getAttribute("type") === "rainbow") {
            const getNextDrop = (): string => ["red", "green", "blue", "all"][Math.floor(Math.random() * 4)]

            handleRipple = (manual: boolean, id: string) => {
                if (id === "blue") {
                    this.whichWave = getNextDrop();
                }
                
                if (!manual || this.whichWave === "all" || id === this.whichWave) {
                    this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { manual, id } }));
                    return true;
                }

                return false;
            }

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

            this.ids = ["blue", "green", "red"];

            
        } else {
            handleRipple = (manual: boolean) => {
                this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { manual } }));
                return true;
            }

            let c = {
                start: this.getAttribute("color-start"),
                end: this.getAttribute("color-end"),
                glow: this.getAttribute("color-glow"),
                hover: this.getAttribute("color-hover") || "#ffffff",
            }

            this.colors = [c, c, c];
            this.ids = ["", "", ""];
        }

        this.colors.forEach((color, index) => {
            this.canvases.push(document.createElement("canvas"));
            this.appendChild(this.canvases[index]);
            this.waves.push(new Wave(this.canvases[index], this.parentElement, {
                amplitude: 20,
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
                offset: offset,
                rippleCallback: index === 1 ? handleRipple : () => true,
                id: this.ids[index],
            }));
        });
    }
}

export interface RippleEvent {
    manual: boolean;
    id?: string;
}
