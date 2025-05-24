import { translations } from "../../i18n/i18n";
import { Settings } from "../../utils/Settings";
import { Utils } from "../../utils/utils";

export class TranslatedElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let lang = Settings.get().general.settings.language.value;
        let translated = Utils.getNestedProperty(translations[lang], this.textContent);
        console.log(translations[lang].ui.footer.bottomBar.save)

        if (translated) {
            this.textContent = translated;
        }
    }
}
