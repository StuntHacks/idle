import { UI } from "ui/UI";
import { initGame } from "./game_logic/Game";
import { CustomElements } from "ui/CustomElements";

export const main = async () => {
    const game = initGame();

    // initialize
    CustomElements.initialize();

    document.getElementById("magic-button").addEventListener("click", () => {
        game.timeskip(3 * 3600);
    });

    // PopoverManager.add(new ExportPopover());

    game.start();
    UI.openSubTab("quantum-tab-energy");
    document.addEventListener("contextmenu", (e) => e.preventDefault());
}
