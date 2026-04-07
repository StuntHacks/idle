import { useTranslation } from "i18n/i18n";
import { useSaveHandler } from "SaveHandler/SaveHandler";
import { PopoverElement } from "ui/elements/PopoverElement";

export class ImportPopover extends PopoverElement {
    constructor() {
        super("misc.importSave", `
            <textarea name="import-save" placeholder="${useTranslation("misc.importPlaceholder")}" autofocus></textarea>
        `, false);

        this.buttons = [{
            label: "misc.clipboardImport",
            callback: this.import,
        }];
    }

    private import = () => {
        const textarea = this.querySelector("textarea");

        if (textarea.value) {
            useSaveHandler().loadData(textarea.value);
            useSaveHandler().saveData();
            location.reload();
        } else {
            navigator.clipboard.readText()
                .then(text => {
                    useSaveHandler().loadData(text);
                    useSaveHandler().saveData();
                    location.reload();
                })
                .catch(() => {});
        }

        return false;
    }

    connectedCallback() {
        super.connectedCallback();

        const textarea = this.querySelector("textarea");
        textarea.focus();

        const button = this.querySelector("button");
        textarea.addEventListener("input", () => {
            button.textContent = textarea.value ? useTranslation("misc.import") : useTranslation("misc.clipboardImport");
        });
    }
}
