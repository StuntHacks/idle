import { useTranslation } from "i18n/i18n";
import { ImportResult, useSaveHandler } from "SaveHandler/SaveHandler";
import { PopoverElement } from "ui/elements/PopoverElement";

export class ImportPopover extends PopoverElement {
    constructor() {
        super("misc.importSave", `
            <textarea name="import-save" placeholder="${useTranslation("misc.importPlaceholder")}" autofocus></textarea>
            <p class="error hidden"></p>
        `, false);

        this.buttons = [{
            label: "misc.clipboardImport",
            callback: this.import,
        }];
    }

    private import = () => {
        const textarea = this.querySelector("textarea");

        if (textarea.value) {
            this.applyImport(textarea.value);
        } else {
            navigator.clipboard.readText()
                .then(text => this.applyImport(text))
                .catch(() => this.showError("misc.importClipboardFailed"));
        }

        return false;
    }

    private applyImport(data: string) {
        const result: ImportResult = useSaveHandler().importData(data);
        switch (result) {
            case "ok":
                location.reload();
                break;
            case "invalid":
                this.showError("misc.importInvalid");
                break;
            case "outdated":
                this.showError("misc.importOutdated");
                break;
        }
    }

    private showError(textId: string) {
        const error = this.querySelector(".error");
        error.textContent = useTranslation(textId);
        error.classList.remove("hidden");
    }

    connectedCallback() {
        super.connectedCallback();

        const textarea = this.querySelector("textarea");
        textarea.focus();

        const button = this.querySelector("button");
        const error = this.querySelector(".error");
        textarea.addEventListener("input", () => {
            button.textContent = textarea.value ? useTranslation("misc.import") : useTranslation("misc.clipboardImport");
            error.classList.add("hidden");
        });
    }
}
