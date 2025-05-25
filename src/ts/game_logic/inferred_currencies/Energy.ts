
import { BigNumber } from "bignumber.js"
import { Currencies } from "../Currencies";
import { InferredCurrencies } from "../../ui/InferredCurrencies";
import { Numbers } from "../../numbers/numbers";

export class Energy {
    private static amount = BigNumber(0);

    public static initialize() {
    }

    public static getFormatted(): string {
        let suffix = "";
        let divisor = 1;

        if (this.amount.e < 9) {
            suffix = "MeV";
        } else if (this.amount.e < 12) {
            suffix = "GeV";
            divisor = 1e3;
        } else if (this.amount.e < 15) {
            suffix = "TeV";
            divisor = 1e6;
        } else if (this.amount.e < 18) {
            suffix = "PeV";
            divisor = 1e9;
        } else if (this.amount.e < 21) {
            suffix = "EeV";
            divisor = 1e12;
        } else if (this.amount.e < 24) {
            suffix = "ZeV";
            divisor = 1e15;
        } else {
            return Numbers.getFormatted(this.amount) + "eV";
        }

        return this.amount.dividedBy(1000000).dividedBy(divisor).toFixed(1) + suffix;
    }

    public static get(): BigNumber {
        return this.amount;
    }

    public static update() {
        this.amount = BigNumber(Currencies.particles.find((p => p.hash === "leptons-electron")).amount.multipliedBy(511000));
        InferredCurrencies.update("energy", this.getFormatted());
    }
}
