import { handleError } from "utils/handleError";
import { initGame, useGame } from "./game_logic/Game";
import { UI } from "ui/UI";

export const main = async () => {
    // error handling
    const nativeRaf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
        return nativeRaf((time: DOMHighResTimeStamp) => {
            try {
                callback(time);
            } catch (e) {
                handleError(e);
                useGame().stop();
            }
        });
    };
    const nativeAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (typeof listener !== "function") {
            return nativeAddEventListener.call(this, type, listener, options);
        }
        const wrapped = function(this: unknown, ...args: Parameters<typeof listener>) {
            try {
                return (listener as EventListener).apply(this, args);
            } catch (e) {
                handleError(e);
                useGame().stop();
            }
        };
        return nativeAddEventListener.call(this, type, wrapped, options);
    };
    window.addEventListener("unhandledrejection", (event) => {
        handleError(event.reason);
        useGame().stop();
    });
    window.onerror = (message, source, lineno, colno, error) => {
        handleError(error ?? new Error(`${message} (${source}:${lineno}:${colno})`));
        useGame().stop();
    };

    // start game
    try {
        const game = initGame();

        document.getElementById("magic-button").addEventListener("click", () => {
            game.timeskip(3 * 3600);
        });

        game.start();
        UI.openSubTab("quantum-tab-forces");
        document.addEventListener("contextmenu", (e) => e.preventDefault());
    } catch (e) {
        handleError(e);
        useGame().stop();
    }
}
