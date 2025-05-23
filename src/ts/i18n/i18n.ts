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
                fermions: "Fermions",
                generations: {
                    first: "Generation I",
                    second: "Generation II",
                    third: "Generation III",
                },
                quarks: {
                    up: {
                        name: "Up",
                        flavorText: "",
                    },
                    down: {
                        name: "Down",
                        flavorText: "",
                    },
                    charm: {
                        name: "Charm",
                        flavorText: "",
                    },
                    strange: {
                        name: "Strange",
                        flavorText: "",
                    },
                    top: {
                        name: "Top",
                        flavorText: "",
                    },
                    bottom: {
                        name: "Bottom",
                        flavorText: "",
                    },
                },
                leptons: {
                    electron: {
                        name: "Electron",
                        flavorText: "",
                    },
                    muon: {
                        name: "Muon",
                        flavorText: "",
                    },
                    tau: {
                        name: "Tau",
                        flavorText: "",
                    },
                },
                bosons: {
                    name: "Bosons",
                    higgs: {
                        name: "Higgs Boson",
                        flavorText: "",
                    },
                    gluon: {
                        name: "Gluon",
                        flavorText: "",
                    },
                    photon: {
                        name: "Photon",
                        flavorText: "",
                    },
                    wPlus: {
                        name: "W⁺ Boson",
                        flavorText: "",
                    },
                    wMinus: {
                        name: "W⁻ Boson",
                        flavorText: "",
                    },
                    z: {
                        name: "Z⁰ Boson",
                        flavorText: "",
                    },
                }
            }
        }
    }
}
