import { SettingCategory, SettingDef, QuantumSettings } from "types/Settings";

export const defaultSettings: {
    general: SettingCategory<{ language: SettingDef<"en" | "de">; noTabHistory: SettingDef<boolean> }>;
    gameplay: SettingCategory<{ noOfflineTime: SettingDef<boolean>; autoAcceptOfflineTime: SettingDef<boolean> }>;
    display: SettingCategory<{ darkNavigation: SettingDef<boolean>; reverseBottomBar: SettingDef<boolean>; stillFields: SettingDef<boolean> }>;
    debug: SettingCategory<{ logging: SettingDef<boolean>; verbose: SettingDef<boolean> }>;
    internal: SettingCategory<{ quantum: QuantumSettings }>;
} = {
    general: {
        title: "settings.general.title",
        settings: {
            language: {
                default: "en",
                name: "settings.general.language.name",
                description: "",
                action: "updateLanguage",
                options: [
                    { name: "English", value: "en" },
                    { name: "Deutsch", value: "de" },
                ],
            },
            noTabHistory: {
                default: false,
                name: "settings.general.noTabHistory.name",
                description: "settings.general.noTabHistory.description",
            },
        },
    },
    gameplay: {
        title: "settings.gameplay.title",
        settings: {
            noOfflineTime: {
                default: false,
                name: "settings.gameplay.noOfflineTime.name",
            },
            autoAcceptOfflineTime: {
                default: false,
                name: "settings.gameplay.autoAcceptOfflineTime.name",
            },
        },
    },
    display: {
        title: "settings.display.title",
        settings: {
            darkNavigation: {
                default: false,
                name: "settings.display.darkNavigation.name",
                action: "darkenNavigation",
            },
            reverseBottomBar: {
                default: false,
                name: "settings.display.reverseBottomBar.name",
                action: "reverseBottomBar",
            },
            stillFields: {
                default: false,
                name: "settings.display.stillFields.name",
                description: "settings.display.stillFields.description",
            },
        },
    },
    debug: {
        title: "settings.debug.title",
        settings: {
            logging: {
                default: true,
                name: "settings.debug.logging.name",
            },
            verbose: {
                default: false,
                name: "settings.debug.verbose.name",
            },
        },
    },
    internal: {
        title: "Internal settings",
        settings: {
            quantum: {
                fluctuators: [true, true, true, true, true, true],
                fields: [
                    { selected: "lepton" },
                    { selected: "quark" },
                    { selected: "gluon" },
                    { selected: "higgs" },
                    { selected: "electroweak" },
                    { selected: "neutrino" },
                ],
            },
        },
    },
};
