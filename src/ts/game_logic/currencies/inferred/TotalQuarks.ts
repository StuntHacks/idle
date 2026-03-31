import Decimal from "break_eternity.js";
import { AggregateCurrency } from "../AggregateCurrency";
import { useCurrencyHandler, InferredCurrency } from "../Currencies";
import { QuarkColor } from "./QuarkColor";

const COLOR_HASHES = ["quarks-red", "quarks-green", "quarks-blue"] as const;

export class TotalQuarks extends AggregateCurrency {
    constructor() {
        super("quarks-rgb");
    }

    protected getSources(): string[] {
        return [...COLOR_HASHES];
    }

    private getColorHandler(hash: string): QuarkColor {
        return (useCurrencyHandler().get(hash) as InferredCurrency).handler as unknown as QuarkColor;
    }

    public getAmount(): Decimal {
        return COLOR_HASHES.reduce(
            (min, hash) => Decimal.min(min, this.getColorHandler(hash).getAmount()),
            new Decimal(Infinity)
        );
    }

    public canSpend(amount: Decimal): boolean {
        return COLOR_HASHES.every(hash => this.getColorHandler(hash).canSpend(amount));
    }

    public spend(amount: Decimal): boolean {
        if (!this.canSpend(amount)) return false;

        const before = this.getAmount();

        for (const hash of COLOR_HASHES) {
            this.getColorHandler(hash).spend(amount);
        }

        const total = this.getAmount();
        for (const callback of this.callbacks) {
            callback("quarks-rgb", "spend", amount, before, total);
        }

        return true;
    }
}