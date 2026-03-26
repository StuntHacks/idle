import Decimal from "break_eternity.js";
import { Stage } from "game_logic/Game";
import { QuantumFluctuator } from "./Fluctuator";
import { FluctuatorElement } from "ui/elements/quantum/FluctuatorElement";
import { QuantumFieldElement } from "ui/elements/quantum/QuantumFieldElement";
import { QuantumField } from "./Field";
import { FIELD_DATA } from "./field_data";
import { useSettings } from "utils/SettingsHandler";
import { useSaveHandler } from "SaveHandler/SaveHandler";
import { useStat } from "game_logic/StatHandler";

export class QuantumStage implements Stage {
    public identifier = "quantum";
    private fluctuators: QuantumFluctuator[] = [];
    private fields: QuantumField[] = [];

    constructor() {
        customElements.define("fluctuator-block", FluctuatorElement);
        customElements.define("quantum-field", QuantumFieldElement);
        this.initializeFields();
    }

    public initializeFields() {
        this.fields = [];
        this.fluctuators = [];
        for (let i = 0; i < 6; i++) {
            const key = useSettings().internal.settings.quantum.fields[i].selected;
            let field = FIELD_DATA[key];

            // todo: figure out a better location for this
            if (key === "electroweak" && field.multi) {
                field.multi = { ...field.multi, chance: useSaveHandler().getFlag("quantum.fields.weak_bosons") ? 0.25 : 1 };
            }

            this.fields.push(
                new QuantumField(field, i, key)
            );
            this.fluctuators.push(
                new QuantumFluctuator(document.querySelector(`fluctuator-block[index="${i}"]`), this.fields[i])
            );
        }
    }

    public static getParticleAmount(particle: ParticleModel): Decimal {
        if (particle.type === "quark") {
            return useStat("quark_gain").total;
        } else if (particle.type === "boson") {
            switch (particle.flavor) {
                case "gluon":
                    return useStat("gluon_gain").total;
            }
        } else if (particle.type === "lepton") {
            switch (particle.flavor) {
                case "electron":
                    return useStat("electron_gain").total;
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

export type ParticleType = "lepton" | "quark" | "boson";
export interface ParticleModel {
    type: string;
    flavor?: string | string[];
    color?: string;
    multi?: boolean;
}
