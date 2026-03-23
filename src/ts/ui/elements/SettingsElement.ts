import { Translator } from "i18n/i18n";
import { Settings } from "utils/Settings";

export class SettingsElement extends HTMLElement {
    private category: string;

    constructor() {
        super();
    }

    connectedCallback() {
        this.category = this.getAttribute("for") ?? "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const category = ((Settings.default() as any)[this.category]);
        const title = document.createElement("h1");
        title.textContent = Translator.getTranslation(category.title);
        this.appendChild(title);
    }
}
