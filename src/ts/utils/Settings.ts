import type { Setting, Settings as SettingsType } from 'types/Settings';
import { defaultSettings } from './defaultSettings';

const SETTINGS_NAME = "idledynamics_settings";

class Settings {
    private settings: SettingsType;

    constructor() {
        const data = localStorage.getItem(SETTINGS_NAME);
        if (data === null) {
            this.reset();
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const deepMerge = (base: any, override: any): SettingsType => {
            const result = { ...base };
            for (const key in override) {
                if (override[key] && typeof override[key] === "object" && !Array.isArray(override[key])) {
                    result[key] = deepMerge(base[key] ?? {}, override[key]);
                } else {
                    result[key] = override[key];
                }
            }
            return result;
        }

        this.settings = deepMerge(Settings.default(), JSON.parse(data));
    }

    public static default(): SettingsType {
        return defaultSettings;
    }

    public get(): SettingsType {
        return this.settings;
    }

    public set(settings: Partial<SettingsType>): void {
        if (this.settings) {
            this.settings = {...this.settings, ...settings};
        } else {
            this.settings = { ...Settings.default(), ...settings };
        }

        this.save();
    }

    // trust me bro we'll add types to javascript bro it'll be so much better bro
    public setSpecific<
        C extends keyof SettingsType,
        K extends keyof SettingsType[C]["settings"],
        V extends SettingsType[C]["settings"][K] extends Setting<infer U> ? U : never,
    >(cat: C, key: K, value: V): void {
        (this.get()[cat].settings as Record<K, Setting<V>>)[key].value = value;
        this.save();
    };

    public save() {
        localStorage.setItem(SETTINGS_NAME, JSON.stringify(this.settings));
    }

    public reset(): void {
        this.settings = Settings.default();
        this.save();
    }
}

let _instance: Settings;
export const useSettings = (): SettingsType => {
    if (!_instance) throw new Error("Call initSettings() first");
    return _instance.get();
};
export const useSettingsObject = (): Settings => {
    if (!_instance) throw new Error("Call initSettings() first");
    return _instance;
};
export const initSettings = (): Settings => {
    _instance = new Settings();
    return _instance;
};
