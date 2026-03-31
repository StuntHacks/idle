import Decimal from "break_eternity.js";
import { InferredCurrency } from "./InferredCurrency";
import { InferredCurrencyCallback, Currency, useCurrencyHandler } from "./Currencies";
import { Numbers } from "numbers/numbers";
import { Logger } from "utils/Logger";

export abstract class AggregateCurrency extends InferredCurrency {
    public override readonly isPersisted: boolean = false;
    protected callbacks: InferredCurrencyCallback[] = [];
    protected hash: string;

    constructor(hash: string) {
        super();
        this.hash = hash;
    }

    protected abstract getSources(): string[];

    public getAmount(): Decimal {
        return this.getSources().reduce(
            (sum, hash) => sum.plus((useCurrencyHandler().get(hash) as Currency).amount),
            new Decimal(0)
        );
    }

    public canSpend(amount: Decimal): boolean {
        return this.getAmount().gte(amount);
    }

    public spend(amount: Decimal): boolean {
        if (!this.canSpend(amount)) return false;

        const before = this.getAmount();
        const sources = this.getSources()
            .map(hash => ({ hash, amount: (useCurrencyHandler().get(hash) as Currency).amount }))
            .sort((a, b) => b.amount.minus(a.amount).toNumber());

        let remaining = amount;
        for (const source of sources) {
            if (remaining.lte(0)) break;
            const drain = Decimal.min(remaining, source.amount);
            useCurrencyHandler().spend(source.hash, drain);
            remaining = remaining.minus(drain);
        }

        const total = this.getAmount();
        for (const callback of this.callbacks) {
            callback(this.hash, "spend", amount, before, total);
        }

        return true;
    }

    public canSpendAtomic(amounts: { hash: string; amount: Decimal }[]): boolean {
        return amounts.every(({ hash, amount }) => {
            const c = useCurrencyHandler().get(hash);
            return c && !c.inferred && (c as Currency).amount.gte(amount);
        });
    }

    public setAmount(_amount: Decimal): void {
        Logger.error("AggregateCurrency", "Cannot set amount of an aggregate currency")
        void _amount;
    }

    public getFormatted(amount?: Decimal): string {
        return Numbers.getFormatted(amount ?? this.getAmount());
    }

    public registerCallback(callback: InferredCurrencyCallback): void {
        this.callbacks.push(callback);
    }
}
