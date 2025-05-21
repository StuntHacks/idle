import { SaveHandler } from '../SaveHandler/SaveHandler';
import type { Settings as SettingsType } from '../types/Settings';

export class Settings {
    private static settings: SettingsType;

    public static default(): SettingsType {
        return {
            general: {
                title: "General settings",
                settings: {
                    noTabHistory: {
                        value: false,
                        default: false,
                        name: "Disable tab history",
                        description: "Doesn't save changing between tabs in the browser history, so the back button leaves this page instead"
                    },
                }
            },
            gameplay: {
                title: "Gameplay settings",
                settings: {
                    noOfflineTime: {
                        value: false,
                        default: false,
                        name: "Disable offline time"
                    },
                }
            },
            debug: {
                title: "Debug settings",
                settings: {
                    logging: {
                        value: true,
                        default: true,
                        name: "Enable logging"
                    },
                    verbose: {
                        value: true,
                        default: true,
                        name: "Verbose logging"
                    }
                }
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
