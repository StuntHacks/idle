import { FieldsTabUI } from "ui/stages/quantum/FieldsTab";
import { UI } from "../../UI";
import { Wave } from "../../stages/quantum/Wave";
import { FieldModel } from "game_logic/stages/quantum/Field";
import { TranslatedElement } from "../TranslatedElement";
import { usePopoverManager } from "ui/PopoverManager";

export class QuantumFieldElement extends HTMLElement {
    private waves: Wave[] = [];
    private offset: number = 0;
    private data: FieldModel;
    private clickCallback: (position: number) => void;
    
    private canvases: HTMLCanvasElement[] = [];
    private surface: HTMLDivElement;
    private tabContainer: HTMLElement;
    private labelElement: HTMLDivElement;

    constructor(data: FieldModel) {
        super();
        if (!data) return;
        this.data = data;
    }

    public setClickCallback(callback: (position: number) => void) {
        this.clickCallback = callback;
    }

    public ripplePassive(x: number) {
        this.waves.forEach(wave => { wave.ripple(x, 20, 6.5, 0.05) });
    }

    public ripple(x: number, index: number) {
        if (this.data.triple || index === -1) {
            for (let wave of this.waves) {
                wave.ripple(x, 100);
            }
        } else {
            this.waves[index].ripple(x, 100);
        }
    }

    private handleClick = () => {
        window.requestAnimationFrame(this.handleClick);
        let rect = this.surface.getBoundingClientRect();

        if ((UI.mouseDown && UI.mouseY >= rect.y && UI.mouseY <= rect.bottom)) {
            if (
                this.tabContainer.querySelector(".tab.active") === null &&
                this.tabContainer.classList.contains("active") &&
                !usePopoverManager().isActive()
            ) {
                this.clickCallback(UI.mouseX);
            }
        }
    }

    public updatePosition() {
        for (const wave of this.waves) {
            wave.handleResize();
        }
    }

    public getWaveOffset(): number {
        return this.surface.offsetTop + (this.surface.clientHeight / 2);
    }

    connectedCallback() {
        if (!this.data) return;
        this.labelElement = document.createElement("div");
        this.labelElement.addEventListener("click", (e: MouseEvent) => {
            FieldsTabUI.open(e);
        });
        this.labelElement.appendChild(new TranslatedElement(this.data.name));
        this.labelElement.classList.add("field-label", this.data.gradient);
        this.appendChild(this.labelElement);

        this.handleClick = this.handleClick.bind(this);
        this.surface = document.createElement("div");
        this.surface.classList.add("field-surface");
        if (this.surface) {
            let rect = this.surface.getBoundingClientRect();
            this.offset = rect.y + (rect.height / 2) - 90;

            this.surface.addEventListener("mouseenter", (e: MouseEvent) => {
                for (let wave of this.waves) {
                    if (!wave.isHovered()) {
                        wave.setHovered(true);
                        wave.ripple(e.clientX, 20, 6.5, 0.05);
                    }
                }
            });
            this.surface.addEventListener("mouseleave", () => {
                for (let wave of this.waves) {
                    wave.setHovered(false);
                }
            });

            window.requestAnimationFrame(this.handleClick);
        }
        this.appendChild(this.surface);

        this.tabContainer = this.closest("stage-tab") as HTMLElement;
        const width = this.data.thick ? 12 : 3;
        const copies = this.data.triple ? 3 : 1;
        const contained = this.hasAttribute("contained");

        for (const field of this.data.subFields) {
            for (let i = 0; i < copies; i++) {
                const canvas = document.createElement("canvas");
                this.canvases.push(canvas);
                this.appendChild(canvas);
                this.waves.push(new Wave(canvas, this.parentElement, {
                    amplitude: 20,
                    frequency: 1,
                    speed: 0.02,
                    lineWidth: width,
                    color: {
                        start: field.fieldColor.start || "#ffffff",
                        end: field.fieldColor.end || "#ffffff",
                        glow: field.fieldColor.glow || "#ffffff",
                        hover: "#ffffff",
                    },
                    pointCount: 10,
                    offset: this.offset,
                    maxRippleAmplitude: 200,
                }, contained));
            }
        }
    }
}
