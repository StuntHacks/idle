
import { QuantumFieldElement, RippleEvent } from "./ui/elements/QuantumFieldElement";
import { TranslatedElement } from "./ui/elements/TranslatedElement";
import { CurrencyElement } from "./ui/elements/CurrencyElement";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Wave } from "./ui/Wave";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";
import { ToolTip } from "./ui/elements/ToolTip";
import { ResourceGainElement } from "./ui/elements/ResourceGainElement";
import { ResourceGainHandler } from "./ui/ResourceGainHandler";
import { BigNumber } from "bignumber.js"
import { UI } from "./ui/UI";
import { Currencies } from "./game_logic/Currencies";
import { Translator } from "./i18n/i18n";
import { SystemTabElement } from "./ui/elements/SystemTabElement";
import { Game } from "./game_logic/Game";

export const main = () => {
    BigNumber.config({ EXPONENTIAL_AT: 6, DECIMAL_PLACES: 1, ROUNDING_MODE: BigNumber.ROUND_FLOOR });

    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    let mainContainer = document.getElementById("main");

    ResourceGainHandler.initialize("resource-gain-container");
    let fields = document.getElementsByTagName("quantum-field");
    for (let i = 0; i < fields.length; i++) {
        fields[i].addEventListener("ripple", function (e: CustomEventInit<RippleEvent>) {
            if (JSON.stringify(e.detail.particle)) {
                ResourceGainHandler.gainResource(ResourceGainHandler.getParticleResourceFromField(e.detail.particle, new BigNumber("1")), (e.detail.x - 10), (e.detail.y + 100))
            }
        });
    }

    // initialize
    Translator.initialize();
    Currencies.initialize();
    UI.initialize();

    customElements.define("translated-string", TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement);
    customElements.define("resource-gain", ResourceGainElement);
    customElements.define("tool-tip", ToolTip);
    customElements.define("currency-display", CurrencyElement);
    customElements.define("system-tab", SystemTabElement);

    document.getElementById("save-button").addEventListener("click", () => {
        UI.flashSaveIndicator();
    });

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
    Game.update();
}
