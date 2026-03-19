
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Settings } from "./utils/Settings";
import { UI } from "./ui/UI";
import { Currencies } from "./game_logic/currencies/Currencies";
import { Translator } from "./i18n/i18n";
import { Game } from "./game_logic/Game";
import { CustomElements } from "ui/CustomElements";

export const main = async () => {
    const game = new Game();
    let data = SaveHandler.getData();
    Settings.set(data.settings);

    // initialize
    Translator.initialize();
    Currencies.initialize("resource-gain-container");
    UI.initialize();
    CustomElements.initialize();

    game.start();
    // document.addEventListener("contextmenu", (e) => e.preventDefault());
}
