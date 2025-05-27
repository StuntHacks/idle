
import { QuantumFieldElement, RippleEvent } from "./ui/elements/QuantumFieldElement";
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

export const main = () => {
    BigNumber.config({ EXPONENTIAL_AT: 6, DECIMAL_PLACES: 1, ROUNDING_MODE: BigNumber.ROUND_FLOOR });

    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    let mainContainer = document.getElementById("main");

    let fields = document.getElementsByTagName("quantum-field");
    for (let i = 0; i < fields.length; i++) {
        fields[i].addEventListener("ripple", function (e: CustomEventInit<RippleEvent>) {
            if (JSON.stringify(e.detail.particle)) {
                let amount = new BigNumber(1);

                if (e.detail.particle.all && e.detail.particle.type === "quark") {
                    let hash = Currencies.getFromQuantumField({ ...e.detail.particle });
                    let hashRed = hash.replace("rgb", "red");
                    Currencies.gain(hashRed, amount);
                    let hashGreen = hashRed.replace("red", "green");
                    Currencies.gain(hashGreen, amount);
                    let hashBlue = hashRed.replace("red", "blue");
                    Currencies.gain(hashBlue, amount);
                    Currencies.spawnGainElement(hash, amount, e.detail.x - (Math.floor(Math.random() * 20) - 10), e.detail.y);
                } else {
                    let hash = Currencies.getFromQuantumField(e.detail.particle);
                    Currencies.gain(hash, amount);
                    Currencies.spawnGainElement(hash, amount, e.detail.x - (Math.floor(Math.random() * 20) - 10), e.detail.y);
                }
            }
        });
    }

    // initialize
    Currencies.initialize("resource-gain-container");
    Translator.initialize();
    Currencies.initialize();
    UI.initialize();
    Game.initialize();

    customElements.define("translated-string", TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement);
    customElements.define("resource-gain", ResourceGainElement);
    customElements.define("tool-tip", ToolTip);
    customElements.define("currency-display", CurrencyElement);
    customElements.define("system-tab", SystemTabElement);

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
