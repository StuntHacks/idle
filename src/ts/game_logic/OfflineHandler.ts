import { Logger } from "utils/Logger";
import { Utils } from "utils/utils";
import { SaveHandler } from "SaveHandler/SaveHandler";
import { OfflineProgressUI } from "ui/OfflineProgress";
import { Settings } from "utils/Settings";

export class OfflineHandler {
    public static async calculateOfflineProgress() {
        if (!Settings.get().gameplay.settings.noOfflineTime.value) {
            const time = Date.now() - SaveHandler.getData().timestamp;
            OfflineProgressUI.initUI();

            Logger.log("Game", `Calculating progress for ${Utils.getTimeString(time)} of offline time...`);
            OfflineProgressUI.setDuration(Utils.getTimeString(time));
            //await new Promise(resolve => setTimeout(resolve, 5000));

            if (time > 60 * 1000) {
                OfflineProgressUI.renderProgress({ foo: 0 });
            } else {
                OfflineProgressUI.dismiss();
            }
        } else {
            OfflineProgressUI.dismiss();
        }
    }
}
