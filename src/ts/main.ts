import { handleError } from "utils/handleError";
import { initGame, stopGame } from "./game_logic/Game";

const crash = (e: unknown) => {
    stopGame();
    handleError(e);
};

export const main = async () => {
    // error handling
    window.addEventListener("unhandledrejection", (event) => crash(event.reason));
    window.onerror = (message, source, lineno, colno, error) => {
        crash(error ?? new Error(`${message} (${source}:${lineno}:${colno})`));
    };

    // start game
    try {
        const game = initGame();

        document.getElementById("magic-button").addEventListener("click", () => {
            game.timeskip(3 * 3600);
        });

        game.start();
        document.addEventListener("contextmenu", (e) => e.preventDefault());
    } catch (e) {
        crash(e);
    }
}
