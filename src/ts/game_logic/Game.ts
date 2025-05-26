import { Currencies } from "./currencies/Currencies";
import { Energy } from "./currencies/inferred/Energy";

export class Game {
    public static initialize() {
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
