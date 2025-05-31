import { BigNumber } from "bignumber.js"

export abstract class InferredCurrency {
    public abstract getFormatted(): string;
    public abstract getAmount(): BigNumber;
    public abstract setAmount(amount: BigNumber): void;
}
