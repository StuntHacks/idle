import { ChangeLogElement } from "./elements/ChangeLogElement";
import { CurrencyElement } from "./elements/CurrencyElement";
import { GameTimeElement } from "./elements/GameTimeElement";
import { ResourceGainElement } from "./elements/ResourceGainElement";
import { StatInfoElement } from "./elements/StatInfoElement";
import { StageTabElement } from "./elements/StageTabElement";
import { ToolTip } from "./elements/ToolTip";
import { UpgradeElement } from "./elements/UpgradeElement";

export class CustomElements {
    public static initialize() {
        customElements.define("resource-gain", ResourceGainElement);
        customElements.define("tool-tip", ToolTip);
        customElements.define("currency-display", CurrencyElement);
        customElements.define("stage-tab", StageTabElement);
        customElements.define("stat-upgrade", UpgradeElement);
        customElements.define("stat-info", StatInfoElement);
        customElements.define("game-time", GameTimeElement);
        customElements.define("change-log", ChangeLogElement);
    }
}
