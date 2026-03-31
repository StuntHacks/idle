import Decimal from "break_eternity.js";
import { InferredCurrencyCallback } from "./Currencies";

export abstract class InferredCurrency {
    public abstract getFormatted(amount?: Decimal): string;
    public abstract getAmount(): Decimal;
    public abstract setAmount(amount: Decimal): void;
    public abstract canSpend(amount: Decimal): boolean;
    public abstract spend(amount: Decimal): boolean;
    public abstract registerCallback(callback: InferredCurrencyCallback): void;
}
