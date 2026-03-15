import { Logger } from "utils/Logger";
import { StatHandler } from "./StatHandler";
import { Utils } from "utils/utils";
import { SaveHandler } from "SaveHandler/SaveHandler";

export class Game {
    static calculateOfflineProgress() {
        Logger.log("Game", `Calculating progress for ${Utils.getTimeString(Date.now() - SaveHandler.getData().timestamp)} of offline time...`);
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
