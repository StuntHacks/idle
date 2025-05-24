import { Currencies as CurrencyLogic } from "../game_logic/Currencies"
import { Numbers } from "../numbers/numbers";
import { BigNumber } from "bignumber.js"

export class Currencies {
    private static currencies: Currency[] = [];

    public static registerCurrency(element: string, id: string, consolidation: string[] = undefined) {
        this.currencies.push({
            element: document.querySelector(`#${element} span`) as HTMLDivElement,
            id,
            consolidation
        })
    }

    public static updateCurrencies() {
        for (let currency of this.currencies) {
            if (currency.element) {
                if (currency.consolidation) {
                    let amount = new BigNumber(0);
                    for (let r of currency.consolidation) {
                        let found = CurrencyLogic.particles.find((p => p.hash === r));
                        if (found) {
                            amount.plus(found.amount)
                        }
                    }
                    currency.element.innerText = Numbers.getFormatted(amount);
                } else {
                    currency.element.innerText = Numbers.getFormatted(CurrencyLogic.particles.find((p => p.hash === currency.id)).amount);
                }
            }
        }
    }
}

interface Currency {
    element: HTMLDivElement;
    id: string;
    consolidation?: string[];
}
