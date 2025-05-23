
import { QuantumFieldElement, RippleEvent } from "./ui/custom_elements/QuantumFieldElement";
import { TranslatedElement } from "./ui/custom_elements/TranslatedElement";
import { translations } from "./i18n/i18n";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Wave } from "./ui/Wave";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";
import { ToolTip } from "./ui/custom_elements/ToolTip";

export const main = () => {
    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    customElements.define("translated-string", TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement);
    customElements.define("tool-tip", ToolTip);

    let mainContainer = document.getElementById("main");

    document.getElementById("quark-field").addEventListener("ripple", (e: CustomEventInit<RippleEvent>) => {
        console.log("ripple", e.detail.id)
    })

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
}
