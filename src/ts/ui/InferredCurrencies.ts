export class InferredCurrencies {
    private static currencies: CurrencyMap = {};

    public static register(name: string, element: HTMLElement) {
        let c = this.currencies[name];
        if (c) {
            c.push(element);
        } else {
            this.currencies[name] = [element];
        }
    }

    public static update(name: string, amount: string) {
        if (this.currencies[name]) {
            for (let c of this.currencies[name]) {
                c.innerText = amount;
            }
        }
    }
}

interface CurrencyMap {
    [key: string]: HTMLElement[];
}
