import Decimal from "break_eternity.js";
import { InferredCurrencyCallback } from "./Currencies";
import { CutoffType } from "numbers/numbers";

export abstract class InferredCurrency {
    public readonly isPersisted: boolean = true;
    public abstract getFormatted(amount?: Decimal, maxPrecision?: number, cutoff?: CutoffType): string;
    public abstract getAmount(): Decimal;
    public abstract setAmount(amount: Decimal): void;
    public abstract canSpend(amount: Decimal): boolean;
    public abstract spend(amount: Decimal): boolean;
    public abstract registerCallback(callback: InferredCurrencyCallback): void;
}
