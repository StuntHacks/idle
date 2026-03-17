
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Settings } from "./utils/Settings";
import { BigNumber } from "bignumber.js"
import { UI } from "./ui/UI";
import { Currencies } from "./game_logic/currencies/Currencies";
import { Translator } from "./i18n/i18n";
import { Game } from "./game_logic/Game";
import { OfflineHandler } from "game_logic/OfflineHandler";
import { Utils } from "utils/utils";
import { CustomElements } from "ui/CustomElements";

export const main = async () => {
    BigNumber.config({ EXPONENTIAL_AT: 6, DECIMAL_PLACES: 1, ROUNDING_MODE: BigNumber.ROUND_FLOOR });

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

    if (Utils.compareVersions(data.gameVersion, Utils.getVersionString()) < 0) {
        document.getElementById("tab-version").classList.add("updated");
        UI.switchSystemTab("version");
    } else {
        UI.switchSystemTab("quantum");
    }
    // document.addEventListener("contextmenu", (e) => e.preventDefault());
}
