import { OfflineResults } from "game_logic/Game";
import { TranslatedElement } from "./elements/TranslatedElement";
import { UI } from "./UI";
import { useSettings } from "utils/SettingsHandler";

export class OfflineProgressUI {
    static initUI() {
        document.getElementById("offline-progress").classList.add("rendering");
    }
    public static initialize() {
        document.getElementById("offline-progress-button").addEventListener("click", () => OfflineProgressUI.dismiss());
    }

    public static dismiss() {
        UI.selectStartingTab();
        document.getElementById("offline-progress").classList.add("dismissed");
    }

    public static setDuration(duration: string) {
        document.getElementById("offline-duration").textContent = duration;
    }

    public static renderProgress(progress: OfflineResults) {
        void progress;
        if (useSettings().gameplay.settings.autoAcceptOfflineTime?.value) {
            OfflineProgressUI.dismiss();
        } else {
            document.getElementById("offline-progress").classList.remove("loading");
            const title = document.getElementById("offline-progress-title") as TranslatedElement;
            title.refresh("misc.offlineProgress");
        }
    }
}
