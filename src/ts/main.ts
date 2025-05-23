
import { QuantumFieldElement, RippleEvent } from "./ui/custom_elements/QuantumFieldElement";
import { TranslatedElement } from "./ui/custom_elements/TranslatedElement";
import { translations } from "./i18n/i18n";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Wave } from "./ui/Wave";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";
import { ToolTip } from "./ui/custom_elements/ToolTip";
import { ResourceGainElement } from "./ui/custom_elements/ResourceGainElement";

export const main = () => {
    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    customElements.define("translated-string", TranslatedElement);
    customElements.define("quantum-field", QuantumFieldElement);
    customElements.define("resource-gain", ResourceGainElement);
    customElements.define("tool-tip", ToolTip);

    let mainContainer = document.getElementById("main");

    document.getElementById("quark-field").addEventListener("ripple", (e: CustomEventInit<RippleEvent>) => {
        console.log("ripple", e.detail.id)
    })

    let resourceContainer = document.getElementById("resource-gain-container");

    document.addEventListener("click", function () {
        console.log("click");
        let resource = document.createElement("resource-gain");
        resource.setAttribute("x", "400");
        resource.setAttribute("y", Math.floor(Math.random() * resourceContainer.clientWidth) + "");
        resource.setAttribute("type", ["up", "down", "strange", "charm", "top", "bottom", "electron", "muon", "tau"][Math.floor(Math.random() * 9)]);
        resource.setAttribute("color", ["red", "green", "blue"][Math.floor(Math.random() * 3)]);
        resource.setAttribute("amount", "1.34e17");
        resourceContainer.appendChild(resource);
    })

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
}
