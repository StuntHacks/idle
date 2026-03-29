import upgrades from "game_logic/data/upgrades.json";
import _ from "lodash";
import { useTranslation } from "i18n/i18n";
import { Energy } from "game_logic/currencies/inferred/Energy";
import { UpgradeDef } from "types/SaveFile";
import Decimal from "break_eternity.js";
import { Currency, InferredCurrencyCallback, useCurrency, useCurrencyHandler } from "game_logic/currencies/Currencies";
import { Numbers } from "numbers/numbers";
import { useFlag, useSaveHandler } from "SaveHandler/SaveHandler";
import { useStat, useStatHandler } from "game_logic/StatHandler";

export class UpgradeElement extends HTMLElement {
    private def: UpgradeDef;
    private namespace: string;

    private detailsElement: HTMLDivElement;
    private costElement: HTMLSpanElement;
    private levelsElement: HTMLSpanElement;
    private currentEffectElement: HTMLSpanElement;
    private tooltip: HTMLElement;

    constructor() {
        super();
    }

    private getCurrentLevel(): number {
        const saved = useSaveHandler().getUpgrades().find((u) => u.id === this.def.id);
        return saved ? saved.levels : 0;
    }

    private isCompleted(): boolean {
        if (this.def.type === "flag") {
            return useFlag(this.def.target);
        }
        return this.def.levels != null && this.getCurrentLevel() >= this.def.levels;
    }

    private getCost(): Decimal {
        return useStatHandler().calculateCost(this.def, this.getCurrentLevel(), 1);
    }

    private updateCost() {
        const cost = this.getCost();
        switch (this.def.currency) {
            case "energy":
                this.costElement.innerText = Energy.getFormatted(cost);
                break;
            default:
                this.costElement.innerText = Numbers.getFormatted(cost);
                break;
        }
    }

    private updateCurrentEffect() {
        if (!this.currentEffectElement) return;
        this.tooltip.hidden = this.getCurrentLevel() === 0;

        const level = this.getCurrentLevel();
        const effect = useStatHandler().getUpgradeEffect(this.def, level);
        const label = useTranslation(useStat(this.def.target)?.title);

        if (effect === null) {
            this.currentEffectElement.innerText = useTranslation("misc.noEffect");
            return;
        }

        switch (this.def.type) {
            case "additive":
                this.currentEffectElement.innerText = `${label} +${Numbers.getFormatted(effect, 2)}`;
                break;
            case "multiplicative":
            case "additive_multiplicative":
                this.currentEffectElement.innerText = `${label} x${Numbers.getFormatted(effect, 2)}`;
                break;
        }
    }

    private updateLevels() {
        if (this.levelsElement) {
            this.levelsElement.innerText = `${this.getCurrentLevel()}/${this.def.levels}`;
        }
    }

    connectedCallback() {
        const id = this.getAttribute("upgrade");
        this.namespace = this.getAttribute("namespace");
        this.def = _.get(upgrades, this.namespace).find((u: UpgradeDef) => u.id === id) as UpgradeDef;

        this.detailsElement = document.createElement("div");
        this.detailsElement.classList.add("details");

        const title = document.createElement("span");
        title.innerText = useTranslation(this.def.title);
        this.detailsElement.appendChild(title);

        const effect = document.createElement("span");
        effect.classList.add("effect");

        if (this.def.effect) {
            effect.innerText = useTranslation(this.def.effect);
        }

        if (this.def.type !== "flag") {
            if (this.def.effect) {
                effect.insertAdjacentHTML("beforeend", "<br />");
            }

            const statTitle = useStat(this.def.target)?.title ?? this.def.target;
            effect.insertAdjacentText("beforeend", useTranslation(statTitle));

            switch (this.def.type) {
                case "additive":
                    effect.insertAdjacentText("beforeend", ` +${Numbers.getFormatted(new Decimal(this.def.amount), 2)}`);
                    break;
                case "multiplicative":
                    effect.insertAdjacentText("beforeend", ` x${Numbers.getFormatted(new Decimal(this.def.amount), 2)}`);
                    break;
                case "additive_multiplicative":
                    effect.insertAdjacentText("beforeend", ` x${Numbers.getFormatted(new Decimal(this.def.amount), 2)} (${useTranslation("misc.additive")})`);
                    break;
            }
        }

        this.detailsElement.appendChild(effect);

        if (this.def.levels) {
            this.levelsElement = document.createElement("span");
            this.levelsElement.classList.add("amount");
            this.detailsElement.appendChild(this.levelsElement);
            this.updateLevels();
        }

        if (this.def.type !== "flag") {
            this.tooltip = document.createElement("tool-tip");
            this.tooltip.setAttribute("center", "");
            this.tooltip.setAttribute("orientation", "bottom");
            const label = document.createElement("translated-string");
            this.currentEffectElement = document.createElement("span");
            this.currentEffectElement.classList.add("flavor-text");
            this.currentEffectElement.classList.add("current-amount");
            label.innerText = "misc.currentEffect";
            this.tooltip.appendChild(label);
            this.tooltip.appendChild(this.currentEffectElement);
            this.appendChild(this.tooltip);
            this.updateCurrentEffect();
        }

        this.costElement = document.createElement("span");
        this.costElement.classList.add("cost");
        this.updateCost();

        if (this.isCompleted()) {
            this.classList.add("completed");
        }

        const checkCost = (total?: Decimal) => {
            if (total == null) {
                const c = useCurrency(this.def.currency);
                total = c.inferred ? c.handler.getAmount() : (c as Currency).amount;
            }
            this.classList.toggle("disabled", !total.greaterThanOrEqualTo(this.getCost()));
        };

        const currencyCallback: InferredCurrencyCallback = (_hash, _type, _amount, _before, total) => {
            checkCost(total);
        };
        useCurrencyHandler().registerCallback(currencyCallback, this.def.currency);

        this.appendChild(this.detailsElement);
        this.appendChild(this.costElement);
        checkCost();

        this.costElement.addEventListener("click", () => {
            if (this.isCompleted()) return;

            const result = useStatHandler().gainUpgrade(this.namespace, this.def.id, true);
            if (!result) return;

            this.updateCost();
            this.updateLevels();
            this.updateCurrentEffect();
            checkCost();

            if (this.isCompleted()) {
                this.classList.add("completed-transition");
                this.addEventListener("animationend", () => {
                    this.classList.remove("completed-transition");
                    this.classList.add("completed");
                }, { once: true });
            }
        });
    }
}
