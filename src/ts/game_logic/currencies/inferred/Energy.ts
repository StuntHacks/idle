
import { BigNumber } from "bignumber.js"
import { Numbers } from "../../../numbers/numbers";
import { Currencies } from "../Currencies";
import { StatHandler } from "../../StatHandler";

export class Energy {
    private static amount = BigNumber(0);

    public static initialize() {
        Currencies.registerInferred("energy", this);
        Currencies.registerCallback((hash: string, amount: BigNumber) => {
            this.amount = this.amount.plus(amount.multipliedBy(StatHandler.get("energy_gain").total.multipliedBy(511000)));
        }, "leptons-electron");
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
}
