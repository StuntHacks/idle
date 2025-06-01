import { Currencies, Currency, InferredCurrency } from "game_logic/currencies/Currencies"
import { Numbers } from "numbers/numbers";
import { QuantumFieldElement } from "./QuantumFieldElement";
import { BigNumber } from "bignumber.js"

export class CurrencyElement extends HTMLElement {
    private currencies: string[] = [];
    private element: HTMLSpanElement;
    private inferred: boolean;
    private max: string;
    private counter: boolean;
    private last: string;

    constructor() {
        super();
    }

    private getValue() {
        if (this.inferred) {
            return (Currencies.get(this.currencies[0]) as InferredCurrency).handler.getFormatted();
        } else {
            let amount = new BigNumber(0);
            for (let c of this.currencies) {
                let found = Currencies.get(c) as Currency;
                if (found) {
                    amount = amount.plus(found.amount);
                }
            }

            let text = Numbers.getFormatted(amount);
            if (this.counter) {
                text += `/${this.max}`;
            }
            return text;
        }
    }

    connectedCallback() {
        let name = this.getAttribute("name");
        this.element = this.querySelector(":scope > span");
        this.inferred = this.hasAttribute("inferred");

        if (this.hasAttribute("counter")) {
            this.counter = true;
            this.max = this.getAttribute("max");
        }

        let field = this.getAttribute("field-id");
        if (field) {
            let fieldElement = document.getElementById(field) as QuantumFieldElement;
            this.addEventListener("mouseenter", () => {
                if (fieldElement) {
                    let x = Math.floor(Math.random() * window.innerWidth);
                    fieldElement.ripplePassive(x);
                }
            });
        }

        if (name) {
            this.currencies = name.split(',');
            let self = this;

            function update() {
                let value = self.getValue();
                if (value !== self.last) {
                    self.last = value;
                    self.element.innerText = value;
                }
                window.requestAnimationFrame(update);
            }

            window.requestAnimationFrame(update);
        }
    }
}
