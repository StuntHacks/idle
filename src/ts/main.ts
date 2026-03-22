import { Currencies } from "./game_logic/currencies/Currencies";
import { Game } from "./game_logic/Game";
import { CustomElements } from "ui/CustomElements";

export const main = async () => {
    const game = new Game();

    // initialize
    Currencies.initialize("resource-gain-container");
    CustomElements.initialize();

    document.getElementById("magic-button").addEventListener("click", () => {
        game.timeskip(3 * 3600);
    });

    game.start();
    // document.addEventListener("contextmenu", (e) => e.preventDefault());
}
