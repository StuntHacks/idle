
import { QuantumFieldElement, RippleEvent } from "./ui/custom_elements/QuantumFieldElement";
import { TranslatedElement } from "./ui/custom_elements/TranslatedElement";
import { translations } from "./i18n/i18n";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Wave } from "./ui/Wave";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";

export const main = () => {
    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    customElements.define("translated-string", TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement);

    let mainContainer = document.getElementById("main");

    document.getElementById("electron-field").addEventListener("ripple", (e: CustomEventInit<RippleEvent>) => {
        console.log("rippled", e.detail.manual);
    })

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
}
