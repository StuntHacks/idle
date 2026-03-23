import { Settings } from "utils/Settings";
import en from "./translations/en.json";
import _ from "lodash";

export class Translator {
    public static translations: TranslationMap = {};

    public static getTranslation(id: string, lang?: string): string {
        if (!lang) lang = Settings.get().general.settings.language.value;
        let result = _.get(this.translations[lang], id);

        if (!result) {
            result = _.get(this.translations["en"], id);
        }

        return result ?? id;
    }

    public static initialize() {
        this.translations = {
            "en": en,
        };
    }
}

interface TranslationMap {
    [key: string]: unknown;
}
