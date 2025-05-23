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

    ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05, max: number = 1) {
        this.waves.forEach(wave => { wave.ripple(x, manual, strength, speed, decay, max) });
    }

    connectedCallback() {
        let amount = parseInt(this.parentElement.getAttribute("data-fields"));
        let offset = (this.parentElement.clientHeight / (amount + 1)) * parseInt(this.getAttribute("index"));
        (this.getElementsByClassName("field-label")[0] as HTMLDivElement).style.top = (offset - 60) + "px";
        let handleRipple;

        if (this.getAttribute("type") === "rainbow") {
            const getNextDrop = (): string => {
                if (Math.random() < 0.1) {
                    return "all";
                }

                return ["red", "green", "blue"][Math.floor(Math.random() * 3)];
            }

            handleRipple = (manual: boolean, id: string) => {
                if (!manual) {
                    return true;
                }

                if (id === this.ids[0]) {
                    this.whichWave = getNextDrop();
                }

                if (this.whichWave === "all" || id.includes(this.whichWave)) {
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

            this.ids = [`${this.id}-blue`, `${this.id}-green`, `${this.id}-red`];
        } else {
            handleRipple = (manual: boolean, id: string) => {
                this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { manual, id } }));
                return true;
            }

            let c = {
                start: this.getAttribute("color-start"),
                end: this.getAttribute("color-end"),
                glow: this.getAttribute("color-glow"),
                hover: this.getAttribute("color-hover") || "#ffffff",
            }

            if (this.getAttribute("type") === "triple") {
                this.colors = [c, c, c];
                this.ids = [this.id, "", ""];
            } else {
                this.colors = [c];
                this.ids = [this.id];
            }
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
                rippleCallback: handleRipple,
                id: this.ids[index],
            }));
        });
    }
}

export interface RippleEvent {
    manual: boolean;
    id?: string;
}
