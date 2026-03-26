import { useSettings } from "utils/SettingsHandler";
import en from "./translations/en.json";
import de from "./translations/de.json";
import _ from "lodash";

export class Translator {
    public static translations: TranslationMap = {};

    public static getTranslation(id: string, lang?: string): string {
        if (!lang) lang = useSettings().general.settings.language.value;
        let result = _.get(this.translations[lang], id);

        if (!result) {
            result = _.get(this.translations["en"], id);
        }

        return result ?? id;
    }

    public static initialize() {
        this.translations = {
            "en": en,
            "de": de,
        };
    }
}

interface TranslationMap {
    [key: string]: unknown;
}
