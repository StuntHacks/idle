import { Currencies } from "../../game_logic/Currencies"
import { Numbers } from "../../numbers/numbers";
import { BigNumber } from "bignumber.js"

export class CurrencyElement extends HTMLElement {
    private currencies: string[] = [];
    private element: HTMLSpanElement;

    constructor() {
        super();
    }

    connectedCallback() {
        let name = this.getAttribute('name');
        this.element = this.querySelector('span');

        if (name) {
            this.currencies = name.split(',');
            let self = this;

            function update() {
                let amount = new BigNumber(0);
                for (let c of self.currencies) {
                    let found = Currencies.particles.find((p => p.hash === c));
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
