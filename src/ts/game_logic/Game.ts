import { Energy } from "./inferred_currencies/Energy";

export class Game {
    public static update() {
        let self = this;

        const loop = () => {
            Energy.update();
            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }
}
