import { Translator } from "i18n/i18n";

export class TranslatedElement extends HTMLElement {
    private textId: string;

    constructor(textId?: string) {
        super();
        this.textId = textId;
    }

    public refresh(textId?: string) {
        if (!this.textId || textId) {
            this.textId = textId ?? this.textContent;
        }
        let translated = Translator.getTranslation(this.textId);
        const interpolations = JSON.parse(this.getAttribute("interpolate") || "[]");

        for (let i = 0; i < interpolations.length; i++) {
            translated = translated.replace(`$${i}`, interpolations[i]);
        }

        if (translated) {
            this.innerHTML = translated;
        }
    }

    connectedCallback() {
        this.refresh(this.textId);
    }
}
