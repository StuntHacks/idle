import { BigNumber } from "bignumber.js"
import { InferredCurrencyCallback } from "./Currencies";

export abstract class InferredCurrency {
    public abstract getFormatted(): string;
    public abstract getAmount(): BigNumber;
    public abstract setAmount(amount: BigNumber): void;
    public abstract spend(amount: BigNumber): boolean;
    public abstract registerCallback(callback: InferredCurrencyCallback): void;
}
