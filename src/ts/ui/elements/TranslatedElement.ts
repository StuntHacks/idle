import { Translator } from "i18n/i18n";

export class TranslatedElement extends HTMLElement {
    private textId: string;

    constructor(textId?: string) {
        super();
        this.refresh(textId);
    }

    public refresh(textId?: string) {
        this.textId = textId ?? this.textContent;
        let translated = Translator.getTranslation(this.textId);

        if (translated) {
            this.innerHTML = translated;
        }
    }

    connectedCallback() {
        this.refresh();
    }
}
