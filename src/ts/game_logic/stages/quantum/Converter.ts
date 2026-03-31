import { useSave, useSaveHandler } from "SaveHandler/SaveHandler";
import { ConverterElement } from "ui/elements/quantum/ConverterElement";
import { useStat, useStatHandler } from "game_logic/StatHandler";
import Decimal from "break_eternity.js";
import { useTranslation } from "i18n/i18n";
import { Numbers } from "numbers/numbers";
import { RenderClock } from "ui/RenderClock";
import { TICK_LENGTH } from "game_logic/Game";
import { useCurrency, useCurrencyHandler } from "game_logic/currencies/Currencies";
import { AggregateCurrency } from "game_logic/currencies/AggregateCurrency";
import { InferredCurrency } from "game_logic/currencies/InferredCurrency";

export class ParticleConverter {
    private baseInterval: number = 5000;
    private enabled: boolean = false;
    private locked: boolean = true;
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

        this.acc += tickLength;
        const interval = this.getInterval();

        if (this.acc >= interval) {
            const num = Math.floor(this.acc / interval);
            const currency = useCurrency(`quarks-${this.color}`) as AggregateCurrency;
            const input = new Decimal(num).multiply(useStatHandler().get("conversion_input")?.total ?? 1);
            if (!currency.canSpend(input)) return; // todo: implement UI state for insufficient currency
            this.acc -= num * interval;

            currency.spend(input);

            useStatHandler().feed("quantum.energy.converters", this.target, new Decimal(num).multiply(input));
        }

        useSave((s) => s.stages.quantum.converters[this.index].acc = this.acc);

        if (!catchingUp) {
            if (interval < 250) {
                this.element.setProgress(1, 1, tickLength);
            } else {
                this.element.setProgress(this.acc, interval, tickLength);
            }
            this.updateEffect();
        }
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
