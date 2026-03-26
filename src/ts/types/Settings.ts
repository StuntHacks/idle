import { SETTINGS_VERSION } from "utils/SettingsHandler";

export interface Settings {
    version: typeof SETTINGS_VERSION;
    general: SettingCategory<{
        language: Setting<"en" | "de">;
        noTabHistory: Setting<boolean>;
    }>;
    gameplay: SettingCategory<{
        noOfflineTime: Setting<boolean>;
        autoAcceptOfflineTime: Setting<boolean>;
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
    internal: SettingCategory<{
        quantum: QuantumSettings;
    }>;
}

export interface SettingsDef {
    general: SettingCategory<{
        language: SettingDef<"en" | "de">;
        noTabHistory: SettingDef<boolean>
    }>;
    gameplay: SettingCategory<{
        noOfflineTime: SettingDef<boolean>;
        autoAcceptOfflineTime: SettingDef<boolean>
    }>;
    display: SettingCategory<{
        darkNavigation: SettingDef<boolean>;
        reverseBottomBar: SettingDef<boolean>;
        stillFields: SettingDef<boolean>
    }>;
    debug: SettingCategory<{
        logging: SettingDef<boolean>;
        verbose: SettingDef<boolean>
    }>;
    internal: SettingCategory<{
        quantum: QuantumSettings
    }>;
}

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

export type QuantumFieldType = "lepton" | "quark" | "gluon" | "higgs" | "electroweak" | "neutrino";
export interface QuantumFieldSettings {
    selected: QuantumFieldType;
    next?: QuantumFieldType;
}

export interface QuantumSettings {
    fluctuators: [boolean, boolean, boolean, boolean, boolean, boolean];
    fields: [
        QuantumFieldSettings, QuantumFieldSettings, QuantumFieldSettings,
        QuantumFieldSettings, QuantumFieldSettings, QuantumFieldSettings
    ];
}
