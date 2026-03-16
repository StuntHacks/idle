import { OfflineResults } from "game_logic/Game";
import { TranslatedElement } from "./elements/TranslatedElement";

export class OfflineProgressUI {
    public static renderProgress(progress: OfflineResults) {
        void progress;
        document.getElementById("offline-progress").classList.remove("loading");
        const title = document.getElementById("offline-progress-title") as TranslatedElement;
        title.textContent = "misc.offlineProgress";
        title.refresh();
    }
}
