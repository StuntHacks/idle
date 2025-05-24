
import { QuantumFieldElement, RippleEvent } from "./ui/custom_elements/QuantumFieldElement";
import { TranslatedElement } from "./ui/custom_elements/TranslatedElement";
import { translations } from "./i18n/i18n";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Wave } from "./ui/Wave";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";
import { ToolTip } from "./ui/custom_elements/ToolTip";
import { ResourceGainElement } from "./ui/custom_elements/ResourceGainElement";
import { ResourceGainHandler } from "./ui/ResourceGainHandler";
import { BigNumber } from "bignumber.js"

export const main = () => {
    BigNumber.config({ EXPONENTIAL_AT: 6 })

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

    ResourceGainHandler.initialize("resource-gain-container");
    let fields = document.getElementsByTagName("quantum-field");
    for (let i = 0; i < fields.length; i++) {
        fields[i].addEventListener("ripple", function (e: CustomEventInit<RippleEvent>) {
            if (e.detail.manual && JSON.stringify(e.detail.particle)) {
                ResourceGainHandler.gainResource(ResourceGainHandler.getParticleResourceFromField(e.detail.particle, new BigNumber("3.23e14")), (e.detail.x - 10), (e.detail.y + 100))
            }
        });
    }

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
}
