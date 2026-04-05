import { useSave } from "SaveHandler/SaveHandler";
import { ConverterElement } from "ui/elements/quantum/ConverterElement";
import { useStat, useStatHandler } from "game_logic/StatHandler";
import Decimal from "break_eternity.js";
import { useTranslation } from "i18n/i18n";
import { Numbers } from "numbers/numbers";
import { RenderClock } from "ui/RenderClock";
import { TICK_LENGTH } from "game_logic/Game";
import { useInferredCurrency } from "game_logic/currencies/Currencies";
import { QuarkColor } from "game_logic/currencies/inferred/QuarkColor";
import { Energy } from "game_logic/currencies/inferred/Energy";
import { TotalQuarks } from "game_logic/currencies/inferred/TotalQuarks";
import { useNotif } from "ui/NotificationManager";
import { UI } from "ui/UI";

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

    public toggleLock(force: boolean = undefined) {
        if (force === this.locked && !this.locked) return;
        this.locked = typeof force === "boolean" ? force : !this.locked;
        useSave((s) => s.stages.quantum.converters[this.index].locked = this.locked);
        this.element?.setLocked(this.locked);
    }

    public toggle(force: boolean = undefined) {
        this.enabled = typeof force === "boolean" ? force : !this.enabled;
        useSave((s) => s.stages.quantum.converters[this.index].enabled = this.enabled);
        this.element?.setEnabled(this.enabled);
        this.element.setProgress(this.acc, this.getInterval(), TICK_LENGTH);
    }

    public isLocked(): boolean {
        return this.locked;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public isBlocked(): boolean {
        return this.enabled && !this.running;
    }

    private getInterval() {
        return Math.max(50, new Decimal(this.baseInterval).multiply(useStatHandler().get("conversion_speed")?.total ?? 1).toNumber());
    }

    public update(tickLength: number, catchingUp: boolean) {
        if (this.locked) {
            const unlocked = useInferredCurrency<TotalQuarks>("quarks-rgb").getAmount().gte(this.required);
            if (unlocked) {
                this.toggleLock(false);
                useNotif({
                    title: useTranslation(`notifications.quantum.unlocks.converters.${this.color}`),
                    icon: "lock_open",
                    onClick: () => UI.openSubTab("quantum-tab-energy")
                });
            }
            if (this.locked) return;
        }

        if (!catchingUp) {
            this.updateEffect();
            this.updateCost();
        }

        if (!this.enabled) return;

        const interval = this.getInterval();
        const currency = this.color === "rgb" ?
            useInferredCurrency<TotalQuarks>("quarks-rgb") :
            useInferredCurrency<QuarkColor>(`quarks-${this.color}`);
        const energy = useInferredCurrency<Energy>("energy");
        const input = this.getCost();
        const energyCost = this.energyCost;
        let amount = new Decimal(0);

        if (!this.running) {
            if (currency.canSpend(input) && energy.canSpend(energyCost)) {
                currency.spend(input);
                energy.spend(energyCost);
                this.committed = input;
                this.running = true;
            } else {
                this.acc = 0;
            }
        }

        if (this.running) {
            this.acc += tickLength;

            if (this.acc >= interval) {
                const completedCycles = Math.floor(this.acc / interval);

                const getAffordableCycles = (currency: QuarkColor | TotalQuarks, input: Decimal): number => {
                    const available = currency instanceof TotalQuarks ?
                        currency.getMinAmount() :
                        currency.getAmount();
                    return Math.floor(available.div(input).toNumber()) + 1;
                }

                const affordableCycles = energyCost.gt(0) ?
                    Math.floor(Decimal.min(
                        getAffordableCycles(currency, this.committed),
                        energy.getAmount().div(energyCost)
                    ).toNumber()) + 1 :
                    getAffordableCycles(currency, this.committed);

                const cycles = Math.min(completedCycles, affordableCycles);
                this.acc -= cycles * interval;
                amount = this.committed.multiply(cycles);

                if (currency.canSpend(input) && energy.canSpend(energyCost)) {
                    currency.spend(input);
                    energy.spend(energyCost);
                    this.committed = input;
                    this.running = true;
                } else {
                    this.running = false;
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

    public setInput(input: Decimal, energyCost: Decimal) {
        this.input = input;
        this.energyCost = energyCost;
        this.updateCost();
    }

    public getVisualProgress(tickLength: number): number {
        const interval = this.getInterval();
        const subTick = this.acc + (tickLength * RenderClock.alpha);
        return Math.min(subTick / interval, 1);
    }

    private updateEffect() {
        const current = useStatHandler().getContinuousEffect("quantum.energy.converters", this.target);
        const simulated = useStatHandler().getContinuousEffect("quantum.energy.converters", this.target, this.committed);
        const previewInput = this.running ? this.getCost().add(this.committed) : this.getCost();
        const preview = useStatHandler().getContinuousEffect("quantum.energy.converters", this.target, previewInput);
        if (!current || !simulated) return;

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
        if (!element) return;
        this.element = element;
        this.element.setToggleCallback(() => this.callback(this.index));
        this.baseInterval = parseInt(this.element.getAttribute("interval") ?? "5000");
        this.target = this.element.getAttribute("target");
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
            useInferredCurrency<TotalQuarks>(`quarks-rgb`).getAmount().gte(this.required)
        );
        this.toggleLock(!unlocked);
        this.running = (this.acc > 0) && !this.locked;
        if (this.running) this.committed = new Decimal(saved.committed ?? this.getCost());
        this.element.setRunning(this.running);

        this.updateEffect();
        this.updateCost();

        const updateInterval = () => {
            window.requestAnimationFrame(updateInterval);
            this.element.setInterval(this.getInterval());
        }

        window.requestAnimationFrame(updateInterval);
    }
}
