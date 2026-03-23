import { SettingsElement } from "./elements/SettingsElement";
import { PopoverManager } from "./PopoverManager";
import { ExportPopover } from "./popovers/ExportPopover";

export class SettingsUI {
    public static initialize() {
        customElements.define("settings-block", SettingsElement);

        document.getElementById("export-save-button").addEventListener("click", () => {
            PopoverManager.add(new ExportPopover());
        });
    }
}
