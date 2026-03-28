import { useSaveHandler } from "SaveHandler/SaveHandler";
import { useSettings } from "utils/SettingsHandler";
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

    public toggleLock(force: boolean = undefined) {
        this.locked = typeof force === "boolean" ? force : !this.locked;
        this.element?.setLocked(this.locked);
    }

    public toggle(force: boolean = undefined) {
        this.acc = 0;
        this.enabled = typeof force === "boolean" ? force : !this.enabled;
        this.element?.setEnabled(this.enabled);
        useSettings().internal.settings.quantum.converters[this.index] = this.enabled;
    }

    private getInterval() {
        console.log(useStatHandler().get("conversion_speed")?.total);
        return Math.max(50, new Decimal(this.baseInterval).multiply(useStatHandler().get("conversion_speed")?.total ?? 1).toNumber());
    }

    public update(tickLength: number, catchingUp: boolean) {
        if (!this.enabled || this.locked) return;

        this.acc += tickLength;
        const interval = this.getInterval();

        if (this.acc >= interval) {
            console.log(interval)
            useStatHandler().feed("quantum.energy.converters", "conversion_speed", new Decimal(1));
            const num = Math.floor(this.acc / interval);
            this.acc -= num * interval;

            if (!catchingUp) {

            }
        }
    }

    private getFlagString() {
        return `quantum.converters.c${this.index < 4 ? 0 : 1}`;
    }

    constructor(index: number, element: ConverterElement) {
        if (!element) return;
        this.element = element;
        this.element.setToggleCallback(this.toggle.bind(this));
        this.baseInterval = parseInt(this.element.getAttribute("interval") ?? "5000");
        this.element.setInterval(this.getInterval());
        this.index = index;
        
        this.toggle(useSettings().internal.settings.quantum.converters[this.index]);
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
