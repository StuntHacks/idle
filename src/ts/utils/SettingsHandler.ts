import type { Setting, Settings, SavedSettings } from 'types/Settings';
import { defaultSettings } from './defaultSettings';

export const SETTINGS_VERSION = 2;
const SETTINGS_NAME = "idledynamics_settings";

class SettingsHandler {
    private settings: Settings;

    constructor() {
        const data = localStorage.getItem(SETTINGS_NAME);
        if (data === null) {
            this.reset();
            return;
        }

        const parsed = JSON.parse(data) as SavedSettings;
        if (parsed.version === undefined || parsed.version < SETTINGS_VERSION) {
            // todo: implement proper migration
            this.reset();
            return;
        }

        this.settings = SettingsHandler.mergeWithDefs(parsed);
    }

    private static mergeWithDefs(saved: SavedSettings): Settings {
        const categories = Object.fromEntries(
            (Object.keys(defaultSettings) as Array<keyof typeof defaultSettings>).map((cat) => {
                const defCategory = defaultSettings[cat];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const savedCategory = (saved as any)[cat];

                const settings = Object.fromEntries(
                    (Object.keys(defCategory.settings) as Array<keyof typeof defCategory.settings>).map((key) => {
                        const def = defCategory.settings[key];
                        const savedValue = savedCategory?.settings?.[key];

                        if (!("default" in def)) {
                            return [key, savedValue ?? def];
                        }

                        return [key, {
                            ...(def as Record<string, unknown>),
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value: savedValue ?? (def as any).default,
                        }];
                    })
                );

                return [cat, { title: defCategory.title, settings }];
            })
        );

        return { version: SETTINGS_VERSION, ...categories } as Settings;
    }

    private static extractSaved(settings: Settings): SavedSettings {
        const categories = Object.fromEntries(
            (Object.keys(defaultSettings) as Array<keyof typeof defaultSettings>).map((cat) => {
                const category = settings[cat];
                const savedSettings = Object.fromEntries(
                    (Object.keys(category.settings) as Array<keyof typeof category.settings>).map((key) => {
                        const entry = category.settings[key];
                        return [key, "value" in entry ? (entry as Setting<unknown>).value : entry];
                    })
                );
                return [cat, { settings: savedSettings }];
            })
        );

        return { version: SETTINGS_VERSION, ...categories } as SavedSettings;
    }

    public static default(): Settings {
        return SettingsHandler.mergeWithDefs({ version: SETTINGS_VERSION } as SavedSettings);
    }

    public get(): Settings {
        return this.settings;
    }

    // trust me bro we'll add types to javascript bro it'll be so much better bro
    public setSpecific<
        C extends keyof Omit<Settings, "version">,
        K extends keyof Settings[C]["settings"],
        V extends Settings[C]["settings"][K] extends Setting<infer U> ? U : never,
    >(cat: C, key: K, value: V): void {
        (this.get()[cat].settings as Record<K, Setting<V>>)[key].value = value;
        this.save();
    }

    public mutate<C extends keyof Omit<Settings, "version">>(
        cat: C,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fn: (settings: Settings[C]["settings"]) => any
    ) {
        const ret = fn(this.get()[cat].settings);
        this.save();
        return ret;
    }

    public save(): void {
        localStorage.setItem(SETTINGS_NAME, JSON.stringify(SettingsHandler.extractSaved(this.settings)));
    }

    public reset(): void {
        this.settings = SettingsHandler.default();
        this.save();
    }
}

let _instance: SettingsHandler;
export const useSetting = <C extends keyof Omit<Settings, "version">>(
    accessor: C,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (settings: Settings[C]["settings"]) => any
) => {
    if (!_instance) throw new Error("Call initSettings() first");
    return _instance.mutate(accessor, fn);
}
export const useSettings = (): Settings => {
    if (!_instance) throw new Error("Call initSettings() first");
    return _instance.get();
};
export const useSettingsHandler = (): SettingsHandler => {
    if (!_instance) throw new Error("Call initSettings() first");
    return _instance;
};
export const initSettings = (): SettingsHandler => {
    _instance = new SettingsHandler();
    _instance.save();
    return _instance;
};
