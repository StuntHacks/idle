import { Numbers } from "numbers/numbers";
import { CurrencyHandler, CurrencyCallback, InferredCurrencyCallback } from "../Currencies";
import { InferredCurrency } from "../InferredCurrency";
import Decimal from "break_eternity.js";
import { useStat } from "game_logic/StatHandler";
import currencyData from "../../data/currencies.json";

export class Energy extends InferredCurrency {
    private amount = new Decimal(0);
    private callbacks: InferredCurrencyCallback[] = [];

    private static instance: Energy;

    private constructor() {
        super();
    }

    public static initialize(handler: CurrencyHandler) {
        this.instance = new Energy();

        const { stage, group, important } = currencyData.inferred.find(c => c.hash === "energy");
        handler.registerInferred("energy", this.instance, stage, group, important);

        const electronCallback: CurrencyCallback = (hash, type, amount) => {
            if (type === "gain") {
                const before = this.instance.amount;
                const total = before.plus(amount.multiply(useStat("energy_gain").total));
                this.instance.amount = total;

                for (const callback of this.instance.callbacks) {
                    callback("energy", "gain", amount, before, total);
                }
            }
        };

        handler.registerCallback(electronCallback, "leptons-electron");
    }

    public static getFormatted(amount?: Decimal, precision: number = 1): string {
        return this.instance.getFormatted(amount, precision);
    }

    public getFormatted(amount?: Decimal, precision: number = 1): string {
        const value = amount ?? this.amount;

        let suffix = "";
        let divisor = 1;

        if (value.e < 9) {
            suffix = "MeV";
        } else if (value.e < 12) {
            suffix = "GeV";
            divisor = 1e3;
        } else if (value.e < 15) {
            suffix = "TeV";
            divisor = 1e6;
        } else if (value.e < 18) {
            suffix = "PeV";
            divisor = 1e9;
        } else if (value.e < 21) {
            suffix = "EeV";
            divisor = 1e12;
        } else if (value.e < 24) {
            suffix = "ZeV";
            divisor = 1e15;
        } else {
            return Numbers.getFormatted(value) + " eV";
        }

        return value.dividedBy(1000000).dividedBy(divisor).toFixed(precision) + ` ${suffix}`;
    }

    public getAmount(): Decimal {
        return this.amount;
    }

    public setAmount(amount: Decimal) {
        this.amount = amount;
    }

    public canSpend(amount: Decimal): boolean {
        return this.amount.gte(amount);
    }

    public spend(amount: Decimal): boolean {
        if (!this.canSpend(amount)) return false;

        const before = this.amount;
        const total = before.minus(amount);
        this.amount = total;

        for (const callback of this.callbacks) {
            callback("energy", "spend", amount, before, total);
        }

        return true;
    }

    public registerCallback(callback: InferredCurrencyCallback) {
        this.callbacks.push(callback);
    }
}
