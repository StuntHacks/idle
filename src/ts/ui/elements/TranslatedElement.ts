import { useTranslation, useTranslator } from "i18n/i18n";
import { Constants } from "game_logic/Constants";

type Interpolation = string | { constant: string };

export class TranslatedElement extends HTMLElement {
    private textId?: string;

    constructor(textId?: string) {
        super();
        this.textId = textId;
    }

    public refresh(textId?: string) {
        if (!this.textId || textId) {
            this.textId = textId ?? this.textContent ?? "";
        }
        const interpolations: Interpolation[] = JSON.parse(this.getAttribute("interpolate") || "[]");
        const translated = useTranslator().interpolate(
            useTranslation(this.textId ?? ""),
            interpolations.map((value) => (typeof value === "string" ? value : Constants.getFormatted(value.constant))),
        );

        if (translated) {
            this.innerHTML = translated;
        }
    }

    connectedCallback() {
        this.refresh(this.textId);
    }
}
