import { SaveHandler } from 'SaveHandler/SaveHandler';
import type { Settings as SettingsType } from 'types/Settings';
import { defaultSettings } from './defaultSettings';

export class Settings {
    private static settings: SettingsType;

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
    }

    public static reset(): void {
        // TODO: Implement reset logic
        this.settings = this.default();
        SaveHandler.saveData();
    }
}
