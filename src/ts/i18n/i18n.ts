import { TranslationMap } from "../types/Translations";
import { Settings } from "../utils/Settings";
import { Utils } from "../utils/utils";

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
        }
    }
}

export class TranslatedElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let lang = Settings.get().general.settings.language.value;
        this.innerText = Utils.getNestedProperty(translations[lang], this.innerText);
    }
}
