import { Currencies } from "../../game_logic/Currencies"
import { Numbers } from "../../numbers/numbers";
import { BigNumber } from "bignumber.js"
import { QuantumFieldElement } from "./QuantumFieldElement";

export class CurrencyElement extends HTMLElement {
    private currencies: string[] = [];
    private element: HTMLSpanElement;

    constructor() {
        super();
    }

    connectedCallback() {
        let name = this.getAttribute("name");
        this.element = this.querySelector(":scope > span");

        let field = this.getAttribute("field-id");
        if (field) {
            this.addEventListener("mouseenter", () => {
                let element = (document.getElementById(field) as QuantumFieldElement);
                let x = Math.floor(Math.random() * window.innerWidth);
                element.ripple(x, 20, 10, 0.05);
            });
        }

        if (name) {
            this.currencies = name.split(',');
            let self = this;

            function update() {
                let amount = new BigNumber(0);
                for (let c of self.currencies) {
                    let found = Currencies.get(c);
                    if (found) {
                        amount = amount.plus(found.amount);
                    }
                }
                self.element.innerText = Numbers.getFormatted(amount);
                window.requestAnimationFrame(update);
            }

            window.requestAnimationFrame(update);
        }
    }
}
