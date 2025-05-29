
import { QuantumFieldElement } from "./ui/elements/QuantumFieldElement";
import { TranslatedElement } from "./ui/elements/TranslatedElement";
import { CurrencyElement } from "./ui/elements/CurrencyElement";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Wave } from "./ui/Wave";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";
import { ToolTip } from "./ui/elements/ToolTip";
import { ResourceGainElement } from "./ui/elements/ResourceGainElement";
import { BigNumber } from "bignumber.js"
import { UI } from "./ui/UI";
import { Currencies } from "./game_logic/currencies/Currencies";
import { Translator } from "./i18n/i18n";
import { SystemTabElement } from "./ui/elements/SystemTabElement";
import { Game } from "./game_logic/Game";
import { FluctuatorElement } from "./ui/elements/quantum/FluctuatorElement";

export const main = () => {
    BigNumber.config({ EXPONENTIAL_AT: 6, DECIMAL_PLACES: 1, ROUNDING_MODE: BigNumber.ROUND_FLOOR });

    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    let mainContainer = document.getElementById("main");

    // initialize
    Translator.initialize();
    Currencies.initialize("resource-gain-container");
    Game.initialize();
    UI.initialize();

    customElements.define("translated-string", TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement);
    customElements.define("resource-gain", ResourceGainElement);
    customElements.define("tool-tip", ToolTip);
    customElements.define("currency-display", CurrencyElement);
    customElements.define("system-tab", SystemTabElement);
    customElements.define("fluctuator-block", FluctuatorElement);

    document.getElementById("save-button").addEventListener("click", () => {
        SaveHandler.saveData();
    });

    document.getElementById("magic-button").addEventListener("click", () => {
        
    });

    window.addEventListener("beforeunload", () => {
        // handle closing
        SaveHandler.saveData();
    });

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
    Game.update();
}
