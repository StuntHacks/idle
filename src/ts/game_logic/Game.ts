import { StatHandler } from "./StatHandler";

export class Game {
    public static initialize() {
        StatHandler.initialize();
    }

    public static update() {
        const loop = () => {
            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }
}
