import { Currencies } from "../../game_logic/currencies/Currencies"
import { Numbers } from "../../numbers/numbers";
import { BigNumber } from "bignumber.js"
import { QuantumFieldElement } from "./QuantumFieldElement";

export class CurrencyElement extends HTMLElement {
    private currencies: string[] = [];
    private element: HTMLSpanElement;
    private inferred: boolean;
    private max: string;
    private counter: boolean;

    constructor() {
        super();
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
            this.addEventListener("mouseenter", () => {
                let element = (document.getElementById(field) as QuantumFieldElement);
                let x = Math.floor(Math.random() * window.innerWidth);
                element.ripplePassive(x, 20, 10, 0.05);
            });
        }

        if (name) {
            this.currencies = name.split(',');
            let self = this;

            function update() {
                let amount = new BigNumber(0);
                if (self.inferred) {
                    self.element.innerText = Currencies.getInferred(self.currencies[0]).handler.getFormatted();
                } else {
                    for (let c of self.currencies) {
                        let found = Currencies.get(c);
                        if (found) {
                            amount = amount.plus(found.amount);
                        }
                    }
                    self.element.innerText = Numbers.getFormatted(amount);

                    if (self.counter) {
                        self.element.innerText += `/${self.max}`;
                    }
                }
                window.requestAnimationFrame(update);
            }

            window.requestAnimationFrame(update);
        }
    }
}
