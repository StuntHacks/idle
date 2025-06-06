import { Currencies } from "game_logic/currencies/Currencies";
import { Quantum } from "game_logic/systems/quantum/Quantum";
import { QuantumFieldElement } from "../QuantumFieldElement";
import { SaveHandler } from "SaveHandler/SaveHandler";

export class FluctuatorElement extends HTMLElement {
    private disableButton: HTMLSpanElement;
    private upgradeButton: HTMLElement;
    private enabled = true;
    private locked = true;
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
                const now = performance.now();
                const elapsed = now - this.lastTrigger;
                if (elapsed >= this.interval) {
                    this.lastTrigger = now - this.interval;
                }
                break;
        }
    }

    selectFieldElement(id: string) {
        this.fieldElement = document.getElementById(id) as QuantumFieldElement;
        this.updatePosition();
    }

    private tick(timestamp: number) {
        if (this.enabled && !this.locked) {
            let now = performance.now();
            const elapsed = now - this.lastTrigger;

            if (elapsed >= this.interval) {
                const [particle, index] = this.fieldElement.getParticle();
                const num = Math.floor(elapsed / this.interval);
                this.lastTrigger += num * this.interval;

                // todo: consolidate this
                const hash = Currencies.getFromQuantumField(particle);
                const amount = Quantum.getParticleAmount(particle);
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
        this.upgradeButton = this.querySelector(".upgrade-button") as HTMLElement;
        this.disableButton = this.querySelector(".disable-button") as HTMLSpanElement;

        this.disableButton.addEventListener("click", () => {
            this.toggle();
        });

        this.upgradeButton.addEventListener("click", () => {
            this.setInterval(this.interval - 100);
        });

        const updateState = () => {
            this.locked = false;
            this.removeAttribute("locked");
            if (this.getAttribute("index") !== "first") {
                this.parentElement.dataset.hidden = (parseInt(this.parentElement.dataset.hidden) - 1) + "";
            }
            this.lastTrigger = performance.now();
        }

        if (SaveHandler.getFlag(`quantum.fluctuators.${this.getAttribute("index")}`)) {
            updateState();
        }

        SaveHandler.registerFlagCallback(`quantum.fluctuators.${this.getAttribute("index")}`, (flag: string, value: any) => {
            if (value) {
                updateState();
            }
        });

        addEventListener('resize', this.updatePosition.bind(this));

        window.requestAnimationFrame(this.tick);
    }
}
