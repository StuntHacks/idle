import { Translator } from "i18n/i18n";
import { Settings } from "utils/Settings";

export class TranslatedElement extends HTMLElement {
    private textId: string;

    constructor(textId?: string) {
        super();
        this.refresh(textId);
    }

    public refresh(textId?: string) {
        this.textId = textId ?? this.textContent;
        const lang = Settings.get().general.settings.language.value;
        let translated = Translator.getTranslation(this.textId, lang);

        if (translated) {
            this.innerHTML = translated;
        }
    }

    connectedCallback() {
        this.refresh();
    }
}
