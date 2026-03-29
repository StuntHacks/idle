import { useSaveHandler } from "SaveHandler/SaveHandler";
import { ConverterElement } from "ui/elements/quantum/ConverterElement";
import { useStatHandler } from "game_logic/StatHandler";
import Decimal from "break_eternity.js";

export class ParticleConverter {
    private baseInterval: number = 5000;
    private enabled: boolean = false;
    private locked: boolean = true;
    private element: ConverterElement;
    private index: number = -1;
    private acc: number = 0;
    private callback: (index: number) => void;

    public toggleLock(force: boolean = undefined) {
        this.locked = typeof force === "boolean" ? force : !this.locked;
        this.element?.setLocked(this.locked);
    }

    public toggle(force: boolean = undefined) {
        this.acc = 0;
        this.enabled = typeof force === "boolean" ? force : !this.enabled;
        this.element?.setEnabled(this.enabled);
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
            this.acc -= num * interval;
            useStatHandler().feed("quantum.energy.converters", "conversion_speed", new Decimal(num));

            if (!catchingUp) {

            }
        }
    }

    private getFlagString() {
        return `quantum.converters.c${this.index < 4 ? 0 : 1}`;
    }

    constructor(index: number, element: ConverterElement, callback: (index: number) => void) {
        if (!element) return;
        this.element = element;
        this.element.setToggleCallback(() => this.callback(this.index));
        this.baseInterval = parseInt(this.element.getAttribute("interval") ?? "5000");
        this.element.setInterval(this.getInterval());
        this.callback = callback;
        this.index = index;
        this.toggleLock(!useSaveHandler().getFlag(this.getFlagString()));

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
