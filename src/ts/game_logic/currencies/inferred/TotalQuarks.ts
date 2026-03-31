import Decimal from "break_eternity.js";
import { AggregateCurrency } from "../AggregateCurrency";
import { useCurrencyHandler } from "../Currencies";
import { QuarkColor } from "./QuarkColor";
import { InferredCurrency } from "../InferredCurrency";

const COLOR_HASHES = ["quarks-red", "quarks-green", "quarks-blue"] as const;

export class TotalQuarks extends AggregateCurrency {
    constructor() {
        super("quarks-rgb");
    }

    protected getSources(): string[] {
        return [...COLOR_HASHES];
    }

    public getAmount(): Decimal {
        return COLOR_HASHES.reduce(
            (min, hash) => {
                const c = useCurrencyHandler().get(hash) as QuarkColor & { inferred: true };
                return Decimal.min(min, c.getAmount());
            },
            new Decimal(Infinity)
        );
    }

    public canSpend(amount: Decimal): boolean {
        return COLOR_HASHES.every(hash => {
            const c = useCurrencyHandler().get(hash);
            return c?.inferred && (c as any).handler.getAmount().gte(amount);
        });
    }

    public spend(amount: Decimal): boolean {
        if (!this.canSpend(amount)) return false;

        const before = this.getAmount();

        for (const hash of COLOR_HASHES) {
            const c = useCurrencyHandler().get(hash);
            (c as unknown as InferredCurrency).spend(amount);
        }

        const total = this.getAmount();
        for (const callback of this.callbacks) {
            callback("quarks-rgb", "spend", amount, before, total);
        }

        return true;
    }
}
