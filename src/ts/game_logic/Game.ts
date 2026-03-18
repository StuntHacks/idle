import { SaveHandler } from "SaveHandler/SaveHandler";
import { StatHandler } from "./StatHandler";

export interface OfflineResults { [key: string]: unknown }; // placeholder

export class Game {
    public static initialize() {
        StatHandler.initialize();
        this.update();

        window.requestAnimationFrame(SaveHandler.autoSave);
        window.addEventListener("beforeunload", () => {
            // handle closing
            SaveHandler.saveData();
        });
    }

    public static update() {
        const loop = () => {
            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }
}
