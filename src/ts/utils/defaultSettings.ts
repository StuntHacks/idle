import { SettingsDef } from "types/Settings";

export const defaultSettings: SettingsDef = {
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
            }
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
            detailedOfflineProgress: {
                default: false,
                name: "settings.gameplay.detailedOfflineProgress.name",
                description: "settings.gameplay.detailedOfflineProgress.description",
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
                platform: "tablet-up",
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
