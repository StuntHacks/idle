import { handleError } from "utils/handleError";
import { initGame } from "./game_logic/Game";
import { CustomElements } from "ui/CustomElements";

export const main = async () => {
    window.addEventListener("unhandledrejection", (event) => handleError(event.reason));
    window.onerror = (_message, _source, _lineno, _colno, error) => {
        handleError(error);
        return true;
    };
    try {
        const game = initGame();
        CustomElements.initialize();

        document.getElementById("magic-button").addEventListener("click", () => {
            game.timeskip(3 * 3600);
        });

        game.start();
        document.addEventListener("contextmenu", (e) => e.preventDefault());
    } catch (e) {
        handleError(e);
    }
}
