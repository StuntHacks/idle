import Decimal from "break_eternity.js";
import { Currencies } from "game_logic/currencies/Currencies";
import { SaveHandler } from "SaveHandler/SaveHandler";
import { FluctuatorElement } from "ui/elements/quantum/FluctuatorElement";
import { QuantumFieldElement } from "ui/elements/QuantumFieldElement";

export class QuantumFluctuator {
    private baseInterval: number = 1000;
    private enabled: boolean = false;
    private locked: boolean = true;
    private element: FluctuatorElement;
    private index: number = -1;
    private fieldElement: QuantumFieldElement;
    private fieldPosition: DOMRect;
    private acc: number = 0;

    private updatePosition() {
        this.fieldPosition = this.fieldElement?.getBoundingClientRect();
    }

    public toggleLock(force: boolean = undefined) {
        this.locked = typeof force === "boolean" ? force : !this.locked;
        this.element.setLocked(this.locked);

        if (!this.locked && this.index > 0) {
            const container = this.element.closest(".fluctuators") as HTMLElement;
            container.dataset.hidden = `${(parseInt(container.dataset.hidden) - 1)}`;
        }
    }

    public toggle(force: boolean = undefined) {
        this.enabled = typeof force === "boolean" ? force : !this.enabled;
        this.element.setEnabled(this.enabled);
    }

    public tryUpgrade() {
        this.baseInterval *= 0.9;
        this.element.setInterval(this.baseInterval);
    }

    private getInterval() {
        return this.baseInterval;
    }

    public update(tickLength: number, catchingUp: boolean) {
        if (!this.enabled || this.locked) return;

        this.acc += tickLength;
        const interval = this.getInterval();

        if (this.acc >= interval) {
            const num = Math.floor(this.acc / interval);
            this.acc -= num * interval;

            const [particle, index] = this.fieldElement.getParticle();
            const hash = Currencies.getFromQuantumField(particle);
            const amount = new Decimal(1);
            const position = Math.floor(Math.random() * this.fieldPosition.width);

            if (particle.all && particle.type === "quark") {
                const hashRed = hash.replace("rgb", "red");
                Currencies.gain(hashRed, amount.multiply(num));
                const hashGreen = hashRed.replace("red", "green");
                Currencies.gain(hashGreen, amount.multiply(num));
                const hashBlue = hashRed.replace("red", "blue");
                Currencies.gain(hashBlue, amount.multiply(num));
            } else {
                Currencies.gain(hash, amount.multiply(num));
            }

            if (!catchingUp) {
                Currencies.spawnGainElement(hash, amount, position, this.fieldPosition.y + (this.fieldPosition.height / 2) - 20);
                this.fieldElement.ripple(position, index);
            }
        }
    }

    private getFlagString() {
        return `quantum.fluctuators.f${this.index}`;
    }

    constructor(element: FluctuatorElement) {
        this.element = element;
        this.element.setToggleCallback(this.toggle.bind(this));
        this.element.setUpgradeCallback(this.tryUpgrade.bind(this));
        this.index = Number(this.element.getAttribute("index"));

        const fields = document.querySelector("#tab-quantum > .fields").getElementsByTagName("quantum-field") as HTMLCollectionOf<QuantumFieldElement>;
        this.fieldElement = fields[this.index];
        this.updatePosition();
        window.addEventListener('resize', this.updatePosition.bind(this));
        
        this.toggle(SaveHandler.getEnabledFlag(this.getFlagString()));
        this.toggleLock(!SaveHandler.getFlag(this.getFlagString()));

        SaveHandler.registerFlagCallback(this.getFlagString(), (flag: string, value: unknown) => {
            this.toggleLock(!value);
        });
    }
}
