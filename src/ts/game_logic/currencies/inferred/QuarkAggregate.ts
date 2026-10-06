import Decimal from "break_eternity.js";
import { InferredCurrency } from "../InferredCurrency";
import { InferredCurrencyCallback } from "../Currencies";
import { QuarkFilter, QuarkPool } from "../QuarkPool";
import { CutoffType, Numbers, Rounding } from "numbers/numbers";
import { Logger } from "utils/Logger";

export class QuarkAggregate extends InferredCurrency {
    public override readonly isPersisted: boolean = false;
    protected hash: string;
    protected pool: QuarkPool;
    private filter: QuarkFilter;

    constructor(hash: string, pool: QuarkPool, filter: QuarkFilter) {
        super();
        this.hash = hash;
        this.pool = pool;
        this.filter = filter;
    }

    public getAmount(): Decimal {
        return this.pool.available(this.filter);
    }

    public canSpend(amount: Decimal): boolean {
        return this.pool.canAfford([{ filter: this.filter, amount }]);
    }

    public spend(amount: Decimal): boolean {
        return this.pool.spend([{ filter: this.filter, amount }]);
    }

    public setAmount(_amount: Decimal): void {
        Logger.error("QuarkAggregate", "Cannot set readonly currency");
        void _amount;
    }

    public getFormatted(amount?: Decimal, maxPrecision: number = 2, cutoff: CutoffType = { upper: "1e6", lower: "1e-6" }, rounding: Rounding = "floor"): string {
        return Numbers.getFormatted(amount ?? this.getAmount(), maxPrecision, cutoff, rounding);
    }

    public registerCallback(callback: InferredCurrencyCallback): void {
        let last = this.getAmount();
        this.pool.registerCallback(this.filter, (_hash, type, amount) => {
            const total = this.getAmount();
            callback(this.hash, type, amount, last, total);
            last = total;
        });
    }
}

export class QuarkTriplets extends QuarkAggregate {
    constructor(hash: string, pool: QuarkPool) {
        super(hash, pool, {});
    }

    public override getAmount(): Decimal {
        return this.pool.getTriplets();
    }

    public override canSpend(amount: Decimal): boolean {
        return this.pool.canAfford(QuarkPool.getTripletCost(amount));
    }

    public override spend(amount: Decimal): boolean {
        return this.pool.spend(QuarkPool.getTripletCost(amount));
    }
}
