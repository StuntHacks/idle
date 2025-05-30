import { Currencies } from "./currencies/Currencies";
import { Energy } from "./currencies/inferred/Energy";
import { StatHandler } from "./StatHandler";

export class Game {
    public static initialize() {
        StatHandler.initialize();

        Currencies.registerInferred("energy", Energy);
    }

    public static update() {
        let self = this;

        const loop = () => {
            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }
}
