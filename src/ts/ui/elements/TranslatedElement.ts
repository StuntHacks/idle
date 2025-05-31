import { Translator } from "i18n/i18n";
import { Settings } from "utils/Settings";
import _ from "lodash";

export class TranslatedElement extends HTMLElement {
    private textId: string;

    constructor() {
        super();
    }

    connectedCallback() {
        this.textId = this.textContent;
        const lang = Settings.get().general.settings.language.value;
        let translated = Translator.getTranslation(this.textId, lang);

        if (translated) {
            this.textContent = translated;
        }
    }
}
