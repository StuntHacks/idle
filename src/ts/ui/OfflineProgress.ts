import { OfflineResults } from "game_logic/Game";
import { TranslatedElement } from "./elements/TranslatedElement";
import { Settings } from "utils/Settings";

export class OfflineProgressUI {
    static initUI() {
        document.getElementById("offline-progress").classList.add("rendering");
    }
    public static initialize() {
        document.getElementById("offline-progress-button").addEventListener("click", () => OfflineProgressUI.dismiss());
    }

    public static dismiss() {
        document.getElementById("offline-progress").classList.add("dismissed");
    }

    public static renderProgress(progress: OfflineResults) {
        void progress;
        if (Settings.get().gameplay.settings.autoAcceptOfflineTime?.value) {
            OfflineProgressUI.dismiss();
        } else {
            document.getElementById("offline-progress").classList.remove("loading");
            const title = document.getElementById("offline-progress-title") as TranslatedElement;
            title.textContent = "misc.offlineProgress";
            title.refresh();
        }
    }
}
