import { Currencies } from "game_logic/currencies/Currencies";
import { Quantum } from "game_logic/systems/quantum/Quantum";
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
    private height: number = 0;
    private offset: number = 0;
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
                this.lastTrigger = performance.now() - this.interval;
                break;
        }
    }

    selectFieldElement(id: string) {
        this.fieldElement = document.getElementById(id) as QuantumFieldElement;
        this.updatePosition();
    }

    private tick(timestamp: number) {
        if (this.enabled) {
            let now = performance.now();
            const elapsed = now - this.lastTrigger;

            if (elapsed >= this.interval) {
                const [particle, index] = this.fieldElement.getParticle();
                const num = Math.floor(elapsed / this.interval);
                this.lastTrigger += num * this.interval;

                // todo: consolidate this
                const hash = Currencies.getFromQuantumField(particle);
                const amount = Quantum.getParticleAmount(hash);
                const position = Math.floor(Math.random() * this.width);

                if (particle.all && particle.type === "quark") {
                    const hashRed = hash.replace("rgb", "red");
                    Currencies.gain(hashRed, amount.multipliedBy(num));
                    const hashGreen = hashRed.replace("red", "green");
                    Currencies.gain(hashGreen, amount.multipliedBy(num));
                    const hashBlue = hashRed.replace("red", "blue");
                    Currencies.gain(hashBlue, amount.multipliedBy(num));
                    Currencies.spawnGainElement(hash, amount, position, this.offset + (this.height / 2) - 20);
                } else {
                    Currencies.gain(hash, amount.multipliedBy(num));
                    Currencies.spawnGainElement(hash, amount, position, this.offset + (this.height / 2) - 20);
                }
    
                this.fieldElement.ripple(position, index);
            }

        }
        window.requestAnimationFrame(this.tick);
    }

    private setInterval(interval: number) {
        this.interval = interval;
        this.intervalElement.innerText = `${interval}ms`;
    }

    private updatePosition() {
        const rect = this.fieldElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.offset = rect.y;
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

        addEventListener('resize', this.updatePosition.bind(this));

        window.requestAnimationFrame(this.tick);
    }
}
