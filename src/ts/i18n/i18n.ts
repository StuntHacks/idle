import { TranslationMap } from "../types/Translations";

export const translations: TranslationMap = {
    "en": {
        settings: {
            general: {
                title: "General settings",
                noTabHistory: {
                    name: "Disable tab history",
                    description: "Doesn't save changing between tabs in the browser history, so the back button leaves this page instead"
                },
                language: {
                    name: "Language",
                    description: ""
                },
            },
            gameplay: {
                title: "Gameplay settings",
                noOfflineTime: {
                    name: "Disable offline time",
                    description: ""
                },
            },
            display: {
                title: "Display settings",
                darkNavigation: {
                    name: "Dark header & footer",
                    description: "Changes the color of header & footer to be the same as the theme background color"
                },
            },
            debug: {
                title: "Debug settings",
                logging: {
                    name: "Enable logging",
                    description: ""
                },
                verbose: {
                    name: "Verbose logging",
                    description: ""
                },
            },
        },
        ui: {
            header: {

            },
            footer: {
                generations: {
                    first: "Generation I",
                    second: "Generation II",
                    third: "Generation III",
                },
                quarks: {
                    up: "Up",
                    down: "Down",
                    charm: "Charm",
                    strange: "Strange",
                    top: "Top",
                    bottom: "Bottom",
                },
                leptons: {
                    electron: "Electron",
                    muon: "Muon",
                    tau: "Tau",
                },
                bosons: {
                    name: "Bosons",
                    higgs: "Higgs Boson",
                    gluon: "Gluon",
                    photon: "Photon",
                    wPlus: "W⁺",
                    wMinus: "W⁻",
                    z: "Z⁰",
                }
            }
        }
    }
}
