import type { Settings as SettingsType } from 'types/Settings';
import { defaultSettings } from './defaultSettings';
import { Logger } from './Logger';

const SETTINGS_NAME = "idledynamics_settings";

export class Settings {
    private static settings: SettingsType;

    public static initialize() {
        Logger.log("Settings", "Loading settings...");
        let data = localStorage.getItem(SETTINGS_NAME);
        if (data === null) {
            Logger.log("Settings", "No settings found - resetting!");
            this.reset();
        }

        this.set(JSON.parse(data));
    }

    public static default(): SettingsType {
        return defaultSettings;
    }

    public static get(): SettingsType {
        return this.settings;
    }

    public static set(settings: Partial<SettingsType>): void {
        if (this.settings) {
            this.settings = {...this.settings, ...settings};
        } else {
            this.settings = { ...this.default(), ...settings };
        }

        this.save();
    }

    private static save() {
        localStorage.setItem(SETTINGS_NAME, JSON.stringify(this.settings));
    }

    public static reset(): void {
        this.settings = this.default();
        this.save();
    }
}
