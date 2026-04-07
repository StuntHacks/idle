import { SettingsElement } from "./elements/SettingsElement";
import { usePopover } from "./PopoverManager";
import { ExportPopover } from "./popovers/ExportPopover";
import { ImportPopover } from "./popovers/ImportPopover";

export class SettingsUI {
    public static initialize() {
        customElements.define("settings-block", SettingsElement);

        document.getElementById("import-save-button").addEventListener("click", () => {
            usePopover(new ImportPopover());
        });

        document.getElementById("export-save-button").addEventListener("click", () => {
            usePopover(new ExportPopover());
        });
    }
}
