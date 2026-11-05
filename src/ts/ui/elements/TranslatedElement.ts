import { useTranslation, useTranslator } from "i18n/i18n";
import { Constants } from "game_logic/Constants";
import { useStatHandler } from "game_logic/StatHandler";
import { Numbers } from "numbers/numbers";

type Interpolation = string | { constant?: string; stat?: string };

export class TranslatedElement extends HTMLElement {
    private textId?: string;

    constructor(textId?: string) {
        super();
        this.textId = textId;
    }

    public refresh(textId?: string) {
        if (!this.textId || textId) {
            this.textId = (textId ?? this.textContent ?? "");
        }
        const interpolations: Interpolation[] = JSON.parse(this.getAttribute("interpolate") || "[]");
        const translated = useTranslator().interpolate(
            useTranslation(this.textId ?? ""),
            interpolations.map((value) => (typeof value === "string" ? value : (
                value.constant ? Constants.getFormatted(value.constant) : Numbers.getFormatted(useStatHandler().get(value.stat ?? "").total)
            ))),
        );

        if (translated) {
            this.innerHTML = translated;
        }
    }

    connectedCallback() {
        this.refresh(this.textId);
    }
}
