import { Logger } from "utils/Logger";
import { StatHandler } from "./StatHandler";
import { Utils } from "utils/utils";
import { SaveHandler } from "SaveHandler/SaveHandler";
import { OfflineProgressUI } from "ui/OfflineProgress";
import { Settings } from "utils/Settings";

export interface OfflineResults { [key: string]: unknown }; // placeholder

export class Game {
    static async calculateOfflineProgress() {
        if (!Settings.get().gameplay.settings.noOfflineTime.value) {
            Logger.log("Game", `Calculating progress for ${Utils.getTimeString(Date.now() - SaveHandler.getData().timestamp)} of offline time...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            OfflineProgressUI.renderProgress({ foo: 0 });
        }
    }
    public static initialize() {
        StatHandler.initialize();
        this.update();
    }

    public static update() {
        const loop = () => {
            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }
}
