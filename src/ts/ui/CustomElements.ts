import { ChangeLogElement } from "./elements/ChangeLogElement";
import { CurrencyElement } from "./elements/CurrencyElement";
import { GameTimeElement } from "./elements/GameTimeElement";
import { FluctuatorElement } from "./elements/quantum/FluctuatorElement";
import { QuantumFieldElement } from "./elements/QuantumFieldElement";
import { ResourceGainElement } from "./elements/ResourceGainElement";
import { SystemTabElement } from "./elements/SystemTabElement";
import { ToolTip } from "./elements/ToolTip";
import { TranslatedElement } from "./elements/TranslatedElement";
import { UpgradeElement } from "./elements/UpgradeElement";

export class CustomElements {
    public static initialize() {
        customElements.define("translated-string", TranslatedElement);
        customElements.define("quantum-field", QuantumFieldElement);
        customElements.define("resource-gain", ResourceGainElement);
        customElements.define("tool-tip", ToolTip);
        customElements.define("currency-display", CurrencyElement);
        customElements.define("system-tab", SystemTabElement);
        customElements.define("fluctuator-block", FluctuatorElement);
        customElements.define("stat-upgrade", UpgradeElement);
        customElements.define("game-time", GameTimeElement);
        customElements.define("change-log", ChangeLogElement);
    }
}
