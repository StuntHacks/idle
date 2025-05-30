import { BigNumber } from "bignumber.js"
import { StatHandler } from "../../StatHandler";

export class Quantum {
    public static getParticleAmount(hash: string): BigNumber {
        return BigNumber(StatHandler.get("electron_gain").base);
    }

    public static update(): void {
        return;
    }
}
