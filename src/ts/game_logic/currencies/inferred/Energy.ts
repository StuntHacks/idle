
import { Numbers } from "numbers/numbers";
import { StatHandler } from "game_logic/StatHandler";
import { Currencies, CurrencyCallback, InferredCurrencyCallback } from "../Currencies";
import { BigNumber } from "bignumber.js"

export class Energy {
    private static amount = BigNumber(0);
    private static callbacks: InferredCurrencyCallback[] = [];

    public static initialize() {
        Currencies.registerInferred("energy", this);

        const electronCallback: CurrencyCallback = (hash, type, amount) => {
            if (type === "gain") {
                const before = this.amount;
                const total = before.plus(amount.multipliedBy(StatHandler.get("energy_gain").total));
                this.amount = total;

                for (let callback of this.callbacks) {
                    callback(this, "gain", amount, before, total);
                }
            }
        }

        Currencies.registerCallback(electronCallback, "leptons-electron");
    }

    public static getFormatted(amount: BigNumber = undefined): string {
        if (!amount) {
            amount = this.amount;
        }

        let suffix = "";
        let divisor = 1;

        if (amount.e < 9) {
            suffix = "MeV";
        } else if (amount.e < 12) {
            suffix = "GeV";
            divisor = 1e3;
        } else if (amount.e < 15) {
            suffix = "TeV";
            divisor = 1e6;
        } else if (amount.e < 18) {
            suffix = "PeV";
            divisor = 1e9;
        } else if (amount.e < 21) {
            suffix = "EeV";
            divisor = 1e12;
        } else if (amount.e < 24) {
            suffix = "ZeV";
            divisor = 1e15;
        } else {
            return Numbers.getFormatted(amount) + "eV";
        }

        return amount.dividedBy(1000000).dividedBy(divisor).toFixed(1) + suffix;
    }

    public static getAmount(): BigNumber {
        return this.amount;
    }

    public static setAmount(amount: BigNumber) {
        this.amount = amount;
    }

    public static spend(amount: BigNumber) {
        if (this.amount.isGreaterThanOrEqualTo(amount)) {
            const before = this.amount;
            const total = before.minus(amount);
            this.amount = total;

            for (let callback of this.callbacks) {
                callback(this, "spend", amount, before, total);
            }

            return true;
        }

        return false;
    }

    public static registerCallback(callback: InferredCurrencyCallback) {
        this.callbacks.push(callback);
    }
}
