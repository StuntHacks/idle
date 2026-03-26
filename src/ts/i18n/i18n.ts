import { useSettings } from "utils/SettingsHandler";
import en from "./translations/en.json";
import de from "./translations/de.json";
import _ from "lodash";

class Translator {
    public translations: TranslationMap = {};

    public getTranslation(id: string, lang?: string): string {
        if (!lang) lang = useSettings().general.settings.language.value;
        let result = _.get(this.translations[lang], id);

        if (!result) {
            result = _.get(this.translations["en"], id);
        }

        return result ?? id;
    }

    constructor() {
        this.translations = {
            "en": en,
            "de": de,
        };
    }
}

let _instance: Translator;
export const useTranslation = (id: string, lang?: string): string => {
    if (!_instance) throw new Error("Call initTranslator() first");
    return _instance.getTranslation(id, lang);
};
export const initTranslator = () => {
    _instance = new Translator();
    return;
};

interface TranslationMap {
    [key: string]: unknown;
}
