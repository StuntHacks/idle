import { SaveHandler } from '../SaveHandler/SaveHandler';
import type { Settings as SettingsType } from '../types/Settings';

export class Settings {
    private static settings: SettingsType;

    public static default(): SettingsType {
        return {
            logging: {
                enabled: true,
                verbose: false
            }
        }
    }

    public static get(): SettingsType {
        return this.settings;
    }

    public static set(settings: SettingsType): void {
        if (this.settings) {
            this.settings = {...this.settings, ...settings};
        } else {
            this.settings = settings;
        }
    }

    public static reset(): void {
        // TODO: Implement reset logic
        this.settings = undefined;
        SaveHandler.saveData();
    }
}
