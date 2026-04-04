import { initGame } from "./game_logic/Game";
import { CustomElements } from "ui/CustomElements";

export const main = async () => {
    try {
        const game = initGame();
    
        // initialize
        CustomElements.initialize();
    
        document.getElementById("magic-button").addEventListener("click", () => {
            game.timeskip(3 * 3600);
        });
    
        game.start();
        document.addEventListener("contextmenu", (e) => e.preventDefault());
    } catch (e) {
        console.error(e);
        // todo: implement proper migration
        if (window.confirm("Outdated save or settings file found! Proper migration hasn't been implemented yet. Click OK to reset & reload the game")) {
            localStorage.removeItem("idledynamics_saveFile");
            localStorage.removeItem("idledynamics_settings");
            location.reload();
        }
    }
}
