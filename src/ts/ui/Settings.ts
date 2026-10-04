import { SettingsElement } from "./elements/SettingsElement";
import { usePopover } from "./PopoverManager";
import { ExportPopover } from "./popovers/ExportPopover";
import { ImportPopover } from "./popovers/ImportPopover";
import { requireElement } from "utils/dom";

export class SettingsUI {
    public static initialize() {
        customElements.define("settings-block", SettingsElement);

        requireElement("import-save-button").addEventListener("click", () => {
            usePopover(new ImportPopover());
        });

        requireElement("export-save-button").addEventListener("click", () => {
            usePopover(new ExportPopover());
        });
    }
}
