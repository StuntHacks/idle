import upgrades from "game_logic/data/upgrades.json";
import _ from "lodash";
import { Translator } from "i18n/i18n";
import { Energy } from "game_logic/currencies/inferred/Energy";
import { StatHandler } from "game_logic/StatHandler";
import { Upgrade } from "types/SaveFile";
import { BigNumber } from "bignumber.js"
import { Currencies, Currency, InferredCurrencyCallback } from "game_logic/currencies/Currencies";
import { Numbers } from "numbers/numbers";

export class UpgradeElement extends HTMLElement {
    private cost: BigNumber;
    private scaling: number;
    private levels: number = 0;
    private currency: string;
    private disabled: boolean;

    private detailsElement: HTMLDivElement;
    private costElement: HTMLSpanElement;
    private levelsElement: HTMLSpanElement;
    private currentEffectElement: HTMLSpanElement;

    constructor() {
        super();
    }

    private getCost() {
        switch (this.currency) {
            case "energy":
                return BigNumber(this.cost.multipliedBy(this.scaling ** this.levels));
            default:
                return this.cost;
        }
    }

    private updateCost() {
        switch (this.currency) {
            case "energy":
                this.costElement.innerText = Energy.getFormatted(this.getCost());
                break;
            default:
                this.costElement.innerText = Numbers.getFormatted(this.getCost());
        }
    }

    connectedCallback() {
        const id = this.getAttribute("upgrade");
        const namespace = this.getAttribute("namespace");
        const upgrade = _.get(upgrades, namespace).find((u: any) => u.id === id) as Upgrade;
        this.detailsElement = document.createElement("div");
        this.detailsElement.classList.add("details");

        this.cost = BigNumber(upgrade.cost);
        this.scaling = upgrade.costScaling || 1;
        this.levels = this.hasAttribute("levels") ? parseInt(this.getAttribute("levels")) : 0;

        const title = document.createElement("span");
        title.innerText = Translator.getTranslation(upgrade.title, "en");
        this.detailsElement.appendChild(title);

        this.costElement = document.createElement("span");
        this.costElement.classList.add("cost");
        this.currency = upgrade.currency;
        this.updateCost();

        const checkCost = (total: BigNumber = undefined) => {
            if (!total) {
                const c = Currencies.get(this.currency);
                if (c.inferred) {
                    total = c.handler.getAmount();
                } else {
                    total = (c as Currency).amount;
                }
            }

            this.disabled = !total.isGreaterThanOrEqualTo(this.getCost());
            this.classList.toggle("disabled", this.disabled);
        }

        const energyCallback: InferredCurrencyCallback = (hash, type, amount, before, total) => {
            checkCost(total);
        }
        Currencies.registerCallback(energyCallback, "energy");

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

        this.detailsElement.appendChild(effect);

        if (upgrade.levels) {
            this.levelsElement = document.createElement("span");
            this.levelsElement.classList.add("amount");
            this.levelsElement.innerText = `${this.levels}/${upgrade.levels}`;
            this.detailsElement.appendChild(this.levelsElement);
        }

        if (upgrade.type !== "flag") {
            const tooltip = document.createElement("tool-tip");
            tooltip.setAttribute("orientation", "bottom");
            const label = document.createElement("translated-string");
            this.currentEffectElement = document.createElement("span");
            this.currentEffectElement.classList.add("current-amount");
            label.innerText = "misc.currentEffect";
            tooltip.appendChild(label);
            tooltip.appendChild(this.currentEffectElement);
            this.appendChild(tooltip);
        }

        this.appendChild(this.detailsElement);
        this.appendChild(this.costElement);
        checkCost();

        this.costElement.addEventListener("click", (e) => {
            const result = StatHandler.gainUpgrade(namespace, id, true);
            if (result && this.levelsElement) {
                this.levels += 1;
                this.levelsElement.innerText = `${this.levels}/${upgrade.levels}`;
                this.updateCost();
                checkCost();
            }
        });
    }
}
