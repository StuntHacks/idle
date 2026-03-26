import { SettingsElement } from "./elements/SettingsElement";
import { usePopover } from "./PopoverManager";
import { ExportPopover } from "./popovers/ExportPopover";

export class SettingsUI {
    public static initialize() {
        customElements.define("settings-block", SettingsElement);

        document.getElementById("export-save-button").addEventListener("click", () => {
            usePopover(new ExportPopover());
        });
    }
}
