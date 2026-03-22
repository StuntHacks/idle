import { Settings } from "types/Settings";

export const defaultSettings: Settings = {
    general: {
        title: "settings.general.title",
        settings: {
            language: {
                value: "en",
                default: "en",
                name: "settings.general.language.name",
                description: ""
            },
            noTabHistory: {
                value: false,
                default: false,
                name: "settings.general.noTabHistory.name",
                description: "settings.general.noTabHistory.description"
            },
        }
    },
    gameplay: {
        title: "settings.gameplay.title",
        settings: {
            noOfflineTime: {
                value: false,
                default: false,
                name: "settings.gameplay.noOfflineTime.name"
            },
            autoAcceptOfflineTime: {
                value: false,
                default: false,
                name: "settings.gameplay.autoAcceptOfflineTime.name",
            }
        }
    },
    display: {
        title: "settings.display.title",
        settings: {
            darkNavigation: {
                value: false,
                default: false,
                name: "settings.display.darkNavigation.name",
                description: "settings.display.darkNavigation.name"
            },
            reverseBottomBar: {
                value: false,
                default: false,
                name: "settings.display.reverseBottomBar.name",
                description: "settings.display.reverseBottomBar.name"
            },
            stillFields: {
                value: false,
                default: false,
                name: "settings.display.stillFields.name",
                description: "settings.display.stillFields.name"
            },
        }
    },
    debug: {
        title: "settings.debug.title",
        settings: {
            logging: {
                value: true,
                default: true,
                name: "settings.debug.logging.name",
            },
            verbose: {
                value: false,
                default: false,
                name: "settings.debug.verbose.name",
            }
        }
    },
    internal: {
        quantum: {
            fluctuators: [true, true, true, true, true, true],
            fields: [
                { selected: "lepton" },
                { selected: "quark" },
                { selected: "gluon" },
                { selected: "higgs" },
                { selected: "electroweak" },
                { selected: "neutrino" },
            ]
        }
    }
}
