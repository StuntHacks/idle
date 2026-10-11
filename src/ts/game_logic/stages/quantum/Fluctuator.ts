import { useFlag, useSave, useSaveHandler } from "SaveHandler/SaveHandler";
import { FluctuatorElement } from "ui/elements/quantum/FluctuatorElement";
import { QuantumField } from "./Field";
import constants from "game_logic/data/constants.json";
import { useStatHandler } from "game_logic/StatHandler";
import { UpgradeDef } from "types/SaveFile";
import Decimal from "break_eternity.js";

export class QuantumFluctuator {
    private baseInterval: number = constants.quantum.fluctuators.interval;
    private enabled: boolean = false;
    private locked: boolean = true;
    private element: FluctuatorElement;
    private index: number = -1;
    private field: QuantumField;
    private acc: number = 0;
    private positionsBuffer: number[] = [];
    private upgradeDef: UpgradeDef;

    public toggleLock(force?: boolean) {
        this.locked = typeof force === "boolean" ? force : !this.locked;
        this.element.setLocked(this.locked);

        const container = this.element.closest<HTMLElement>(".fluctuators");
        if (!this.locked && this.index > 0 && container) {
            container.dataset.hidden = `${parseInt(container.dataset.hidden ?? "0") - 1}`;
        }
    }

    public toggle(force?: boolean) {
        this.acc = 0;
        this.enabled = typeof force === "boolean" ? force : !this.enabled;
        this.element.setEnabled(this.enabled);
        useSave((s) => s.stages.quantum.fluctuators[this.index] = this.enabled);
    }

    public tryUpgrade() {
        useStatHandler().gainUpgrade("quantum.energy.fluctuators", this.upgradeDef.id, true);
        this.element.setInterval(this.getInterval());
        this.element.setCost(this.getCost());
    }

    private getCost(): Decimal {
        const level = useStatHandler().getUpgradeLevel(this.upgradeDef.id);
        return useStatHandler().calculateCost(this.upgradeDef, level, 1)[0].amount;
    }

    private getInterval() {
        return useStatHandler().get(`fluctuator_interval_multiplier_${this.index}`).total.multiply(this.baseInterval).toNumber();
    }

    private getRandomPosition() {
        const width = Math.max(this.field.getPosition().width - 110, 100);
        let position = Math.random() * width;
        let bestDist = 0;

        for (let attempt = 0; attempt < 10; attempt++) {
            const candidate = Math.random() * width;
            const dist = this.positionsBuffer.reduce(
                (min, p) => Math.min(min, Math.abs(candidate - p)),
                Infinity,
            );
            if (dist > bestDist) {
                bestDist = dist;
                position = candidate;
            }
        }

        this.positionsBuffer.push(position);
        if (this.positionsBuffer.length > 5) {
            this.positionsBuffer.shift();
        }

        return Math.floor(position + 10);
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

    constructor(index: number, element: FluctuatorElement, field: QuantumField) {
        this.element = element;
        this.element.setToggleCallback(this.toggle.bind(this));
        this.element.setUpgradeCallback(this.tryUpgrade.bind(this));
        this.index = index;
        this.field = field;
        this.upgradeDef = useStatHandler().getUpgradeDef("quantum.energy.fluctuators", `fluctuator_interval_multiplier_${index}`) as UpgradeDef;
        this.element.setInterval(this.getInterval());
        this.element.setCost(this.getCost());

        const saved = useSave((s) => s.stages.quantum.fluctuators);
        this.toggle(saved[this.index] ?? true);
        this.toggleLock(!useFlag(this.getFlagString()));

        useSaveHandler().registerFlagCallback(this.getFlagString(), (flag: string, value: unknown) => {
            this.toggleLock(!value);
        });
    }
}
