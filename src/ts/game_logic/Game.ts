import { StatHandler } from "./StatHandler";

export interface OfflineResults { [key: string]: unknown }; // placeholder

export class Game {
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
