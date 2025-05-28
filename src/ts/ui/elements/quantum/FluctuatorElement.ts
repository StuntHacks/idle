import { QuantumFieldElement } from "../QuantumFieldElement";

export class FluctuatorElement extends HTMLElement {
    private disableButton: HTMLSpanElement;
    private increaseButton: HTMLElement;
    private decreaseButton: HTMLElement;
    private enabled = true;
    static observedAttributes = ["disabled"];
    private lastTrigger: number = 0;
    private interval: number = 1000;
    private intervalElement: HTMLSpanElement;
    private width: number = 0;
    private fieldElement: QuantumFieldElement;

    public enable(enable: boolean = true) {
        this.enabled = enable;
    }

    public toggle(enable: boolean = true) {
        if (this.enabled) {
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case "disabled":
                this.enabled = newValue !== "";
                break;
        }
    }

    selectFieldElement(id: string) {
        this.fieldElement = this.closest("system-tab").querySelector(`#${id}`);
    }

    private tick(timestamp: number) {
        if (this.enabled) {
            let now = performance.now();
            if ((now - this.lastTrigger) < this.interval) {
                window.requestAnimationFrame(this.tick);
                return;
            }
            this.lastTrigger = now;
            this.fieldElement.ripple(Math.floor(Math.random() * this.width), 1)
        }
        window.requestAnimationFrame(this.tick);
    }

    private setInterval(interval: number) {
        this.interval = interval;
        this.intervalElement.innerText = `${interval}ms`;
    }

    private updateWidth() {
        this.width = this.fieldElement.clientWidth;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.tick = this.tick.bind(this);
        this.selectFieldElement(`${this.getAttribute("field")}-field`);

        this.enabled = !this.hasAttribute("disabled");

        this.intervalElement = this.querySelector(".interval") as HTMLSpanElement;
        this.decreaseButton = this.querySelector(".decrease") as HTMLElement;
        this.increaseButton = this.querySelector(".increase") as HTMLElement;
        this.disableButton = this.querySelector(".disable-button") as HTMLSpanElement;

        this.disableButton.addEventListener("click", () => {
            this.toggle();
        });

        this.decreaseButton.addEventListener("click", () => {
            this.setInterval(this.interval - 100);
        });

        this.increaseButton.addEventListener("click", () => {
            this.setInterval(this.interval +  100);
        });

        this.updateWidth();
        addEventListener('resize', this.updateWidth.bind(this));

        window.requestAnimationFrame(this.tick);
    }
}
