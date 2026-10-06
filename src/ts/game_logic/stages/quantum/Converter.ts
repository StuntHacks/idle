import { useSave } from "SaveHandler/SaveHandler";
import { ConverterElement } from "ui/elements/quantum/ConverterElement";
import { useStat, useStatHandler } from "game_logic/StatHandler";
import Decimal from "break_eternity.js";
import { useTranslation } from "i18n/i18n";
import { Numbers } from "numbers/numbers";
import { TICK_LENGTH } from "game_logic/Game";
import { useInferredCurrency, useQuarkPool } from "game_logic/currencies/Currencies";
import { QuarkCost, QuarkPool } from "game_logic/currencies/QuarkPool";
import { QuarkAggregate } from "game_logic/currencies/inferred/QuarkAggregate";
import { Energy } from "game_logic/currencies/inferred/Energy";
import { useNotif } from "ui/NotificationManager";
import { UI } from "ui/UI";
import { requireAttribute } from "utils/dom";

export class ParticleConverter {
    private baseInterval: number = 5000;
    private input: Decimal = new Decimal(1);
    private committed: Decimal = new Decimal(0);
    private energyCost: Decimal = new Decimal(0);
    private enabled: boolean = false;
    private locked: boolean = true;
    private running: boolean = false;
    private element: ConverterElement;
    private index: number = -1;
    private acc: number = 0;
    private target: string;
    private color: string;
    private title: string = "";
    private required: Decimal;
    private callback: (index: number) => void;

    public toggleLock(force?: boolean) {
        if (force === this.locked && !this.locked) return;
        this.locked = typeof force === "boolean" ? force : !this.locked;
        useSave((s) => s.stages.quantum.converters[this.index].locked = this.locked);
        this.element.setLocked(this.locked);
    }

    public toggle(force?: boolean) {
        this.enabled = typeof force === "boolean" ? force : !this.enabled;
        useSave((s) => s.stages.quantum.converters[this.index].enabled = this.enabled);
        this.element.setEnabled(this.enabled);
        this.element.setProgress(this.acc, this.getInterval(), TICK_LENGTH);
    }

    public isLocked(): boolean {
        return this.locked;
    }

    public isBlocked(): boolean {
        return this.enabled && !this.running;
    }

    private getInterval() {
        return Math.max(50, new Decimal(this.baseInterval).multiply(useStatHandler().get("conversion_speed")?.total ?? 1).toNumber());
    }

    public update(tickLength: number, catchingUp: boolean) {
        if (this.locked) {
            const unlocked = useInferredCurrency<QuarkAggregate>("quarks-rgb").getAmount().gte(this.required);
            if (unlocked) {
                this.toggleLock(false);
                useNotif({
                    title: useTranslation(`notifications.quantum.unlocks.converters.${this.color}`),
                    icon: "lock_open",
                    onClick: () => UI.switchSubTab("quantum-tab-energy")
                });
            }
            if (this.locked) return;
        }

        if (!catchingUp) {
            this.updateEffect();
            this.updateCost();
            this.element.setInterval(this.getInterval());
        }

        if (!this.enabled) return;

        const interval = this.getInterval();
        const quarks = useQuarkPool();
        const energy = useInferredCurrency<Energy>("energy");
        const input = this.getCost();
        const quarkCost = this.getQuarkCosts();
        let amount = new Decimal(0);

        const start = (): boolean => {
            if (!quarks.canAfford(quarkCost) || !energy.canSpend(this.energyCost)) return false;
            quarks.spend(quarkCost);
            energy.spend(this.energyCost);
            this.committed = input;
            return true;
        };

        if (!this.running) {
            this.running = start();
            if (!this.running) this.acc = 0;
        }

        if (this.running) {
            this.acc += tickLength;

            while (this.acc >= interval) {
                this.acc -= interval;
                amount = amount.plus(this.committed.multiply(useStat("converter_efficiency").total));

                if (!start()) {
                    this.running = false;
                    this.acc = 0;
                    break;
                }
            }
        }

        this.element.setRunning(this.running);

        if (amount.gt(0)) {
            useStatHandler().feed("quantum.energy.converters", this.target, amount);
        }

        useSave((s) => {
            s.stages.quantum.converters[this.index].acc = this.acc;
            s.stages.quantum.converters[this.index].committed = this.committed;
        });

        if (!catchingUp) {
            if (!this.running) {
                this.element.setProgress(0, 1, tickLength);
            } else if (interval < 250) {
                this.element.setProgress(1, 1, tickLength);
            } else {
                this.element.setProgress(this.acc, interval, tickLength);
            }
        }
    }
    private getCost(): Decimal {
        return new Decimal(this.color === "rgb" ? 1 : 3).multiply(this.input);
    }

    private getQuarkCosts(): QuarkCost[] {
        if (this.color === "rgb") return QuarkPool.getTripletCost(this.getCost());
        return [{ filter: { colors: [this.color] }, amount: this.getCost() }];
    }

    public setInput(input: Decimal, energyCost: Decimal) {
        this.input = input;
        this.energyCost = energyCost;
        this.updateCost();
    }

    private updateEffect() {
        const current = useStatHandler().getContinuousEffect("quantum.energy.converters", this.target);
        const simulated = useStatHandler().getContinuousEffect("quantum.energy.converters", this.target, this.committed);
        const previewInput = this.running ? this.getCost().add(this.committed) : this.getCost();
        const preview = useStatHandler().getContinuousEffect("quantum.energy.converters", this.target, previewInput);
        if (!current || !simulated || !preview) return;

        const format = (value: Decimal) => Numbers.getFormatted(
            this.target === "conversion_speed" ? new Decimal(1).div(value) : value, 2
        );
        if (this.getInterval() < 250) {
            this.element.setEffectText(
                `${this.title}<br />` +
                `<span class="effect">x${format(current)}</span><br />`
            );
        } else {
            this.element.setEffectText(
                `${this.title}<br />` +
                `<span class="effect">x${format(current)} ➜ x${format(simulated)}</span><br />` +
                `<span class="preview">` +
                    `➜ x${format(preview)}` +
                `</span>`
            );
        }
    }

    private updateCost() {
        const value = this.running ? this.committed : this.getCost();
        this.element.setCostText(Numbers.getFormatted(value, 0, { upper: "1e4" }));
    }

    constructor(index: number, element: ConverterElement, callback: (index: number) => void, acc?: number) {
        this.element = element;
        this.element.setToggleCallback(() => this.callback(this.index));
        this.baseInterval = parseInt(this.element.getAttribute("interval") ?? "5000");
        this.target = requireAttribute(this.element, "target");
        this.required = new Decimal(this.element.getAttribute("required") ?? 300);
        this.element.setInterval(this.getInterval());

        this.acc = acc ?? 0;
        this.callback = callback;
        this.index = index;
        this.element.setProgress(this.acc, this.getInterval(), TICK_LENGTH);

        this.color = this.element.className;
        this.title = useTranslation(useStat(this.target).title);

        const saved = useSave((s) => s.stages.quantum.converters[this.index]);
        const unlocked = (
            !saved.locked ||
            useInferredCurrency<QuarkAggregate>("quarks-rgb").getAmount().gte(this.required)
        );
        this.toggleLock(!unlocked);
        this.running = (this.acc > 0) && !this.locked;
        if (this.running) this.committed = saved.committed;
        this.element.setRunning(this.running);

        this.updateEffect();
        this.updateCost();
    }
}
