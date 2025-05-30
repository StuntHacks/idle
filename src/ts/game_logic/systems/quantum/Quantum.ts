import { BigNumber } from "bignumber.js"
import { StatHandler } from "../../StatHandler";

export class Quantum {
    public static getParticleAmount(hash: string): BigNumber {
        return StatHandler.getComputedValue(`electron_gain`, BigNumber(1));
    }

    public static update(): void {
        return;
    }
}
