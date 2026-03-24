import { Translator } from "i18n/i18n";
import { useSaveHandler } from "SaveHandler/SaveHandler";
import { PopoverElement } from "ui/elements/PopoverElement";

export class ExportPopover extends PopoverElement {
    constructor() {
        super("misc.exportSave", `
            <pre>${useSaveHandler().getEncoded()}</pre>
        `, false);

        this.buttons = [{
            label: "misc.copy",
            callback: this.copy,
        }];
    }

    private copy = () => {
        const button = this.querySelector("button");
        button.textContent = Translator.getTranslation("misc.copied");
        navigator.clipboard.writeText(this.querySelector("pre").textContent);
        setTimeout(() => button.textContent = Translator.getTranslation("misc.copy"), 1000);
        return false;
    }

    connectedCallback() {
        super.connectedCallback();
    }
}
