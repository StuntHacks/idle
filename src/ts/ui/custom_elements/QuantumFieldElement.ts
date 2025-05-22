import { translations } from "../../i18n/i18n";
import { Settings } from "../../utils/Settings";
import { Utils } from "../../utils/utils";
import { Wave } from "../Wave";

export class QuantumFieldElement extends HTMLElement {
    private wave: Wave;
    private canvas: HTMLCanvasElement;

    constructor() {
        super();
    }

    ripple(x: number, manual: boolean = false, strength: number = 120, speed: number = 10, decay: number = 0.05, max: number = 1, ttl: number | undefined = undefined) {
        this.wave.ripple(x, manual, strength, speed, decay, max, ttl);
    }

    connectedCallback() {
        this.canvas = document.createElement("canvas");
        this.appendChild(this.canvas);

        let offset = ((this.parentElement.clientHeight / 6) / 2) * parseInt(this.getAttribute("index"));

        this.wave = new Wave(this.canvas, this.parentElement, {
            amplitude: 10,
            frequency: 1,
            speed: 0.02,
            lineWidth: 3,
            colorStart: this.getAttribute("color-start"),
            colorEnd: this.getAttribute("color-end"),
            colorGlow: this.getAttribute("color-glow"),
            colorHover: this.getAttribute("color-hover") || "#ffffff",
            pointCount: 10,
            offset: 100 * parseInt(this.getAttribute("index")),
            rippleCallback: (manual: boolean) => {
                this.dispatchEvent(new CustomEvent<RippleEvent>("ripple", { detail: { manual } }));
            }
        });
    }
}

export interface RippleEvent {
    manual: boolean;
}
