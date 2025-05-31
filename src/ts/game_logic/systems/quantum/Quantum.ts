import { BigNumber } from "bignumber.js"
import { StatHandler } from "game_logic/StatHandler";

export class Quantum {
    public static getParticleAmount(hash: string): BigNumber {
        return StatHandler.get("electron_gain").total;
    }

    public static update(): void {
        return;
    }
}
