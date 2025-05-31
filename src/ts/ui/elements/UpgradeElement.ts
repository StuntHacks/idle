import upgrades from "../../game_logic/data/upgrades.json";
import _ from "lodash";
import { Translator } from "../../i18n/i18n";
import { Energy } from "../../game_logic/currencies/inferred/Energy";
import { BigNumber } from "bignumber.js"
import { StatHandler } from "../../game_logic/StatHandler";
import { Upgrade } from "../../types/SaveFile";

export class UpgradeElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const id = this.getAttribute("upgrade");
        const namespace = this.getAttribute("namespace");
        const upgrade = _.get(upgrades, namespace).find((u: any) => u.id === id) as Upgrade;
        const details = document.createElement("div");
        details.classList.add("details");

        const title = document.createElement("span");
        title.innerText = Translator.getTranslation(upgrade.title, "en");
        details.appendChild(title);

        // todo: handle effects of non-descriptive upgrades (x2 etc)
        const effect = document.createElement("span");
        effect.classList.add("effect");
        if (upgrade.effect) {
            effect.innerText = Translator.getTranslation(upgrade.effect, "en");
        }

        if (upgrade.effect && upgrade.type !== "flag") {
            effect.insertAdjacentHTML("beforeend", "<br />");
        }

        if (upgrade.type !== "flag") {
            effect.innerText = Translator.getTranslation(StatHandler.get(upgrade.target).title, "en");

            if (upgrade.type === "additive") {
                effect.innerText += " +";
            } else {
                effect.innerText += " x";
            }

            effect.innerText += upgrade.amount;

            if (upgrade.additive) {
                effect.innerText += ` (${Translator.getTranslation("misc.additive", "en")})`;
            }
        }

        details.appendChild(effect);

        if (upgrade.levels) {
            const amount = document.createElement("span");
            amount.classList.add("amount");
            amount.innerText = `0/${upgrade.levels}`;
            details.appendChild(amount);
        }

        if (upgrade.type !== "flag") {
            const tooltip = document.createElement("tool-tip");
            tooltip.setAttribute("orientation", "bottom");
            const label = document.createElement("translated-string");
            const amount = document.createElement("span");
            amount.classList.add("current-amount");
            label.innerText = "misc.currentEffect";
            tooltip.appendChild(label);
            tooltip.appendChild(amount);
            this.appendChild(tooltip);
        }

        const cost = document.createElement("span");
        cost.classList.add("cost");
        switch (upgrade.currency) {
            case "energy":
                cost.innerText = Energy.getFormatted(BigNumber(upgrade.cost * 1000000));
                break;
            default:
                cost.innerText = upgrade.cost + "";
        }

        this.appendChild(details);
        this.appendChild(cost);

        cost.addEventListener("click", (e) => {
            StatHandler.gainUpgrade(namespace, id);
        });
    }
}
