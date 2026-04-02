import { useSave, useSaveHandler } from "SaveHandler/SaveHandler";
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

export class ParticleConverter {
    private baseInterval: number = 5000;
    private input: Decimal = new Decimal(1);
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
    private callback: (index: number) => void;

    public toggleLock(force: boolean = undefined) {
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

    private getInterval() {
        return Math.max(50, new Decimal(this.baseInterval).multiply(useStatHandler().get("conversion_speed")?.total ?? 1).toNumber());
    }

    public update(tickLength: number, catchingUp: boolean) {
        if (!this.enabled || this.locked) return;

        const interval = this.getInterval();
        const currency = useInferredCurrency<QuarkColor>(`quarks-${this.color}`);
        const energy = useInferredCurrency<Energy>("energy");
        const input = this.getCost();
        const energyCost = this.energyCost;
        let amount = new Decimal(0);

        if (!this.running) {
            if (currency.canSpend(input) && energy.canSpend(energyCost)) {
                currency.spend(input);
                energy.spend(energyCost);
                this.running = true;
            } else {
                this.acc = 0;
            }
        }

        if (this.running) {
            this.acc += tickLength;

            while (this.acc >= interval) {
                this.acc -= interval;
                amount = amount.plus(input);

                if (currency.canSpend(input) && energy.canSpend(energyCost)) {
                    currency.spend(input);
                    energy.spend(energyCost);
                    this.running = true;
                } else {
                    this.running = false;
                    break;
                }
            }
        }

        this.element.setRunning(this.running);

        if (amount.gt(0)) {
            useStatHandler().feed("quantum.energy.converters", this.target, amount);
        }

        useSave((s) => s.stages.quantum.converters[this.index].acc = this.acc);

        if (!catchingUp) {
            if (!this.running) {
                this.element.setProgress(0, 1, tickLength);
            } else if (interval < 250) {
                this.element.setProgress(1, 1, tickLength);
            } else {
                this.element.setProgress(this.acc, interval, tickLength);
            }

            this.updateEffect();
            this.updateCost();
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
        const value = useStatHandler().getContinuousEffect("quantum.energy.converters", this.target);
        if (!value) return;
        const formatted = Numbers.getFormatted(
            this.target === "conversion_speed" ? new Decimal(1).div(value) : value, 2
        );
        this.element.setEffectText(`${this.title}<br />x${formatted}`);
    }

    private updateCost() {
        const value = this.getCost();
        this.element.setCostText(Numbers.getFormatted(value, 0, { upper: "1e4" }));
    }

    private getFlagString() {
        return `quantum.converters.c${this.index < 4 ? 0 : 1}`;
    }

    constructor(index: number, element: ConverterElement, callback: (index: number) => void, acc?: number) {
        if (!element) return;
        this.element = element;
        this.element.setToggleCallback(() => this.callback(this.index));
        this.baseInterval = parseInt(this.element.getAttribute("interval") ?? "5000");
        this.element.setInterval(this.getInterval());
        this.acc = acc ?? 0;
        this.callback = callback;
        this.index = index;
        this.target = this.element.getAttribute("target");
        this.color = this.element.className;
        this.title = useTranslation(useStat(this.target).title);
        this.toggleLock(!useSaveHandler().getFlag(this.getFlagString()));
        this.updateEffect();
        this.updateCost();

        useSaveHandler().registerFlagCallback(this.getFlagString(), (flag: string, value: unknown) => {
            this.toggleLock(!value);
        });

        const updateInterval = () => {
            window.requestAnimationFrame(updateInterval);
            this.element.setInterval(this.getInterval());
        }

        window.requestAnimationFrame(updateInterval);
    }
}
