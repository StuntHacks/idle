import { SaveHandler } from "SaveHandler/SaveHandler";
import { FluctuatorElement } from "ui/elements/quantum/FluctuatorElement";
import { Settings } from "utils/Settings";
import { QuantumField } from "./Field";

export class QuantumFluctuator {
    private baseInterval: number = 1000;
    private enabled: boolean = false;
    private locked: boolean = true;
    private element: FluctuatorElement;
    private index: number = -1;
    private field: QuantumField;
    private acc: number = 0;
    private positionsBuffer: number[] = [];

    public toggleLock(force: boolean = undefined) {
        this.locked = typeof force === "boolean" ? force : !this.locked;
        this.element?.setLocked(this.locked);

        if (!this.locked && this.index > 0) {
            const container = this.element?.closest(".fluctuators") as HTMLElement;
            container.dataset.hidden = `${(parseInt(container.dataset.hidden) - 1)}`;
        }
    }

    public toggle(force: boolean = undefined) {
        this.enabled = typeof force === "boolean" ? force : !this.enabled;
        this.element?.setEnabled(this.enabled);
        Settings.get().internal.quantum.fluctuators[this.index] = this.enabled;
    }

    public tryUpgrade() {
        this.baseInterval *= 0.9;
        this.element?.setInterval(this.baseInterval);
    }

    private getInterval() {
        return this.baseInterval;
    }

    private getRandomPosition() {
        const width = this.field.getPosition().width;
        let bestPosition = Math.random() * width;
        let bestMinDist = 0;

        for (let attempt = 0; attempt < 10; attempt++) {
            const candidate = Math.random() * width;
            const minDist = this.positionsBuffer.reduce(
                (min, p) => Math.min(min, Math.abs(candidate - p)),
                Infinity,
            );
            if (minDist > bestMinDist) {
                bestMinDist = minDist;
                bestPosition = candidate;
            }
        }

        this.positionsBuffer.push(bestPosition);
        if (this.positionsBuffer.length > 5) {
            this.positionsBuffer.shift();
        }

        return Math.floor(bestPosition);
    }

    public update(tickLength: number, catchingUp: boolean) {
        if (!this.enabled || this.locked) return;

        this.acc += tickLength;
        const interval = this.getInterval();

        if (this.acc >= interval) {
            const num = Math.floor(this.acc / interval);
            this.acc -= num * interval;
            this.field.gainParticle(catchingUp ? 0 : this.getRandomPosition(), catchingUp)
        }
    }

    private getFlagString() {
        return `quantum.fluctuators.f${this.index}`;
    }

    constructor(element: FluctuatorElement, field: QuantumField) {
        if (!element) return;
        this.element = element;
        this.element.setToggleCallback(this.toggle.bind(this));
        this.element.setUpgradeCallback(this.tryUpgrade.bind(this));
        this.index = Number(this.element.getAttribute("index"));
        this.field = field;
        
        this.toggle(Settings.get().internal.quantum.fluctuators[this.index]);
        this.toggleLock(!SaveHandler.getFlag(this.getFlagString()));

        SaveHandler.registerFlagCallback(this.getFlagString(), (flag: string, value: unknown) => {
            this.toggleLock(!value);
        });
    }
}
