import upgrades from "../../game_logic/data/upgrades.json";
import _ from "lodash";
import { Translator } from "../../i18n/i18n";
import { Energy } from "../../game_logic/currencies/inferred/Energy";
import { BigNumber } from "bignumber.js"

export class UpgradeElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const id = this.getAttribute("upgrade");
        const upgrade = _.get(upgrades, this.getAttribute("namespace")).find((u: any) => u.id === id);
        const details = document.createElement("div");
        details.classList.add("details");

        const title = document.createElement("span");
        title.innerText = Translator.getTranslation(upgrade.title, "en");
        details.appendChild(title);

        // todo: handle effects of non-descriptive upgrades (x2 etc)
        if (upgrade.effect) {
            const effect = document.createElement("span");
            effect.classList.add("effect");
            effect.innerText = Translator.getTranslation(upgrade.effect, "en");
            details.appendChild(effect);
        }

        if (upgrade.levels) {
            const amount = document.createElement("span");
            amount.classList.add("amount");
            amount.innerText = `0/${upgrade.levels}`;
            details.appendChild(amount);
        }

        const cost = document.createElement("span");
        cost.classList.add("cost");
        console.log(upgrade.currency, upgrade.cost, BigNumber(upgrade.cost).toString(), Energy.getFormatted(BigNumber(upgrade.cost)))
        switch (upgrade.currency) {
            case "energy":
                cost.innerText = Energy.getFormatted(BigNumber(upgrade.cost));
                break;
            default:
                cost.innerText = upgrade.cost;
        }

        this.appendChild(details);
        this.appendChild(cost);
    }
}
