import Decimal from "break_eternity.js";
import { System } from "game_logic/Game";
import { StatHandler } from "game_logic/StatHandler";
import { WaveParticleInfo } from "ui/systems/quantum/Wave";
import { QuantumFluctuator } from "./Fluctuator";
import { FluctuatorElement } from "ui/elements/quantum/FluctuatorElement";

export class QuantumSystem implements System {
    public identifier = "quantum";
    private fluctuators: QuantumFluctuator[] = [];

    constructor() {
        customElements.define("fluctuator-block", FluctuatorElement);

        for (let i = 0; i < 5; i++) {
            this.fluctuators.push(
                new QuantumFluctuator(document.querySelector(`fluctuator-block[index="${i}"]`))
            );
        }
    }

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

    public update(tickLength: number, catchingUp: boolean) {
        for (const fluctuator of this.fluctuators) {
            fluctuator.update(tickLength, catchingUp);
        }
    }
}
