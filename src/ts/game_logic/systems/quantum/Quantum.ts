import Decimal from "break_eternity.js";
import { System } from "game_logic/Game";
import { StatHandler } from "game_logic/StatHandler";
import { WaveParticleInfo } from "ui/Wave";

export class QuantumSystem implements System {
    public identifier = "quantum";

    public getParticleAmount(particle: WaveParticleInfo): Decimal {
        const fieldGain = StatHandler.get("field_gain").total;
        if (particle.type === "quark") {
            return StatHandler.get("quark_gain").total.multiply(fieldGain);
        } else if (particle.type === "boson") {
            switch (particle.flavor) {
                case "gluon":
                    return StatHandler.get("gluon_gain").total.multiply(fieldGain);
            }
        } else if (particle.type === "lepton") {
            switch (particle.flavor) {
                case "electron":
                    return StatHandler.get("electron_gain").total.multiply(fieldGain);
            }
        }

        return new Decimal(0);
    }

    public update(tickLength: number, catchingUp: boolean): void {
        console.log(`Quantum System: Update - tickLength: ${tickLength}, catchingUp: ${catchingUp}`)
        return;
    }
}
