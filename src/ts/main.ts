import { handleError } from "utils/handleError";
import { initGame, stopGame } from "./game_logic/Game";
import { requireElement } from "utils/dom";
import { useSaveHandler } from "SaveHandler/SaveHandler";

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

        requireElement("magic-button").addEventListener("click", () => {
            useSaveHandler().saveData(false, Date.now() - 2 * 3600 * 1000);
            useSaveHandler().reloadWithoutSaving();
        });

        game.start();
        document.addEventListener("contextmenu", (e) => e.preventDefault());
    } catch (e) {
        crash(e);
    }
}
