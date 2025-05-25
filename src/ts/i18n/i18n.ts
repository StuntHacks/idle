import en from "./translations/en.json"

export class Translator {
    public static translations: TranslationMap = {};

    public static initialize() {
        this.translations = {
            "en": en,
        };
    }
}

interface TranslationMap {
    [key: string]: any;
}
