import { Logger } from "utils/Logger";
import { Utils } from "utils/utils";
import { SaveHandler } from "SaveHandler/SaveHandler";
import { OfflineProgressUI } from "ui/OfflineProgress";
import { Settings } from "utils/Settings";

export class OfflineHandler {
    public static async calculateOfflineProgress() {
        if (!Settings.get().gameplay.settings.noOfflineTime.value) {
            Logger.log("Game", `Calculating progress for ${Utils.getTimeString(Date.now() - SaveHandler.getData().timestamp)} of offline time...`);
            //await new Promise(resolve => setTimeout(resolve, 5000));
            OfflineProgressUI.renderProgress({ foo: 0 });
        }
    }
}
