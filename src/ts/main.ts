
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Settings } from "./utils/Settings";
import { UI } from "./ui/UI";
import { Currencies } from "./game_logic/currencies/Currencies";
import { Translator } from "./i18n/i18n";
import { Game } from "./game_logic/Game";
import { OfflineHandler } from "game_logic/OfflineHandler";
import { CustomElements } from "ui/CustomElements";

export const main = async () => {
    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    // initialize
    Translator.initialize();
    Game.initialize();
    Currencies.initialize("resource-gain-container");
    UI.initialize();
    CustomElements.initialize();

    OfflineHandler.calculateOfflineProgress();
    // document.addEventListener("contextmenu", (e) => e.preventDefault());
}
