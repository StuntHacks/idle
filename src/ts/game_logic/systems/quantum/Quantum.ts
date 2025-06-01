import { BigNumber } from "bignumber.js"
import { StatHandler } from "game_logic/StatHandler";
import { WaveParticleInfo } from "ui/Wave";

export class Quantum {
    public static getParticleAmount(particle: WaveParticleInfo): BigNumber {
        if (particle.type === "quark") {
            return StatHandler.get("quark_gain").total;
        } else if (particle.type === "boson") {
            switch (particle.flavor) {
                case "gluon":
                    return StatHandler.get("gluon_gain").total;
                    break;
            }
        } else if (particle.type === "lepton") {
            switch (particle.flavor) {
                case "electron":
                    return StatHandler.get("electron_gain").total;
                    break;
            }
        }

        return BigNumber(0);
    }

    public static update(): void {
        return;
    }
}
