import { SETTINGS_VERSION } from "utils/SettingsHandler";

export interface Settings {
    version: typeof SETTINGS_VERSION;
    general: SettingCategory<{
        language: Setting<"en" | "de">;
        noTabHistory: Setting<boolean>;
        autoSave: Setting<boolean>;
    }>;
    gameplay: SettingCategory<{
        noOfflineTime: Setting<boolean>;
        autoAcceptOfflineTime: Setting<boolean>;
        detailedOfflineProgress: Setting<boolean>;
    }>;
    display: SettingCategory<{
        darkNavigation: Setting<boolean>;
        reverseBottomBar: Setting<boolean>;
        stillFields: Setting<boolean>;
    }>;
    debug: SettingCategory<{
        logging: Setting<boolean>;
        verbose: Setting<boolean>;
    }>;
}

export type SettingsDef = {
    [C in keyof Omit<Settings, "version">]: SettingCategory<{
        [K in keyof Settings[C]["settings"]]:
            Settings[C]["settings"][K] extends Setting<infer T> ? SettingDef<T> : Settings[C]["settings"][K];
    }>;
};

export interface Setting<T> extends SettingDef<T> {
    value: T;
}

export interface SettingDef<T> {
    default: T;
    name: string;
    description?: string;
    options?: { name: string; value: T }[];
    action?: string;
    platform?: "desktop" | "tablet-up" | "tablet-down" | "mobile";
}

export interface SettingCategory<S> {
    title: string;
    settings: S;
}

export type SavedSettings = {
    version: typeof SETTINGS_VERSION;
} & {
    [C in keyof Omit<Settings, "version">]: {
        settings: {
            [K in keyof Settings[C]["settings"]]:
                Settings[C]["settings"][K] extends Setting<infer T> ? T : Settings[C]["settings"][K];
        };
    };
};
