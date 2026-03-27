import { useSaveHandler } from "SaveHandler/SaveHandler";
import { useSettings } from "utils/SettingsHandler";
import { ConverterElement } from "ui/elements/quantum/ConverterElement";

export class ParticleConverter {
    private baseInterval: number = 500;
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
        return this.baseInterval;
    }

    public update(tickLength: number, catchingUp: boolean) {
        if (!this.enabled || this.locked) return;

        this.acc += tickLength;
        const interval = this.getInterval();

        if (this.acc >= interval) {
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
        this.element.setInterval(this.getInterval());
        this.index = index;
        
        this.toggle(useSettings().internal.settings.quantum.converters[this.index]);
        this.toggleLock(!useSaveHandler().getFlag(this.getFlagString()));

        useSaveHandler().registerFlagCallback(this.getFlagString(), (flag: string, value: unknown) => {
            this.toggleLock(!value);
        });
    }
}
