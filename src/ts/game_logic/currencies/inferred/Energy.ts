import { CutoffType, Numbers, Rounding } from "numbers/numbers";
import { CurrencyHandler, CurrencyCallback, InferredCurrencyCallback } from "../Currencies";
import { InferredCurrency } from "../InferredCurrency";
import Decimal from "break_eternity.js";
import { useStat } from "game_logic/StatHandler";
import currencyData from "game_logic/data/currencies.json";

export class Energy extends InferredCurrency {
    private amount = new Decimal(0);
    private callbacks: InferredCurrencyCallback[] = [];

    private static instance: Energy;

    private constructor() {
        super();
    }

    public static initialize(handler: CurrencyHandler) {
        this.instance = new Energy();

        const entry = currencyData.inferred.find(c => c.hash === "energy");
        if (!entry) throw new Error(`Missing energy entry in currencies.json`);
        handler.registerInferred("energy", this.instance, entry.stage, entry.group, entry.important);

        const electronCallback: CurrencyCallback = (hash, type, amount) => {
            if (type === "gain") {
                const before = this.instance.amount;
                const gained = amount.multiply(useStat("energy_gain").total);
                const total = before.plus(gained);
                this.instance.amount = total;

                for (const callback of this.instance.callbacks) {
                    callback("energy", "gain", gained, before, total);
                }
            }
        };

        handler.registerCallback(electronCallback, "leptons-electron");
    }

    public static getFormatted(amount?: Decimal, maxPrecision?: number, rounding?: Rounding): string {
        return this.instance.getFormatted(amount, maxPrecision ?? 1, undefined, rounding);
    }

    public getFormatted(amount?: Decimal, maxPrecision: number = 1, _cutoff?: CutoffType, rounding: Rounding = "floor"): string {
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
            return Numbers.getFormatted(value, maxPrecision, undefined, rounding) + " eV";
        }

        const scaled = value.dividedBy(1000000).dividedBy(divisor).toNumber();
        return Numbers.round(scaled, maxPrecision, rounding).toFixed(maxPrecision) + ` ${suffix}`;
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
