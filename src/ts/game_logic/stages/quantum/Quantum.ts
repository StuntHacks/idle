import Decimal from "break_eternity.js";
import { Stage } from "game_logic/Game";
import { QuantumFluctuator } from "./Fluctuator";
import { FluctuatorElement } from "ui/elements/quantum/FluctuatorElement";
import { QuantumFieldElement } from "ui/elements/quantum/QuantumFieldElement";
import { QuantumField } from "./Field";
import { FIELD_DATA } from "./field_data";
import { useFlag, useSave } from "SaveHandler/SaveHandler";
import { useStat } from "game_logic/StatHandler";
import { ConverterElement } from "ui/elements/quantum/ConverterElement";
import { ParticleConverter } from "./Converter";
import { QuantumUI } from "ui/stages/Quantum";
import { Numbers } from "numbers/numbers";
import { Energy } from "game_logic/currencies/inferred/Energy";

export class QuantumStage implements Stage {
    public identifier = "quantum";
    private fluctuators: QuantumFluctuator[] = [];
    private fields: QuantumField[] = [];
    private converters: ParticleConverter[] = [];
    private activeConverters: number[] = [];
    private conversionInput: Decimal = new Decimal(1);
    private inputElement: HTMLElement;
    private costElement: HTMLElement;
    private energyCostText: string = "";

    constructor() {
        customElements.define("fluctuator-block", FluctuatorElement);
        customElements.define("quantum-field", QuantumFieldElement);
        customElements.define("particle-converter", ConverterElement);
        this.initializeFields();

        const converters = useSave((s) => s.stages.quantum.converters) ?? [];
        for (let i = 0; i < 4; i++) {
            const saved = converters[i] ?? { enabled: false, locked: true, acc: 0 };
            const c = new ParticleConverter(i, document.querySelector(`particle-converter:nth-of-type(${i + 1})`), this.enableConverter, saved.acc);
            c.toggleLock(saved.locked);
            if (saved.enabled) this.activeConverters.push(i);
            this.converters.push(c);
        }

        this.conversionInput = new Decimal(useSave((s) => s.stages.quantum.conversionInput) ?? 1);
        this.inputElement = document.querySelector("#quark-conversion-input .input > span");
        this.costElement = document.querySelector("#quark-conversion-input .energy-cost > span");
        document.getElementById("conversion-decrease").addEventListener("click", () => {
            this.conversionInput = this.conversionInput.divide(10).clampMin(1);
            this.updateConversionInput();
        });
        document.getElementById("conversion-increase").addEventListener("click", () => {
            this.conversionInput = this.conversionInput.multiply(10).clampMax(useStat("max_conversion_input").total ?? 1e9);
            this.updateConversionInput();
        });

        this.updateConversionInput();
        this.updateConverters();
    }

    public initializeFields() {
        this.fields = [];
        this.fluctuators = [];
        for (let i = 0; i < 6; i++) {
            const key = useSave((s) => s.stages.quantum.fields[i]?.selected) ?? Object.keys(FIELD_DATA)[i];
            let field = FIELD_DATA[key];

            // todo: figure out a better location for this
            if (key === "electroweak" && field.multi) {
                field.multi = { ...field.multi, chance: useFlag("quantum.fields.weak_bosons") ? 0.25 : 1 };
            }

            this.fields.push(
                new QuantumField(field, i, key)
            );
            this.fluctuators.push(
                new QuantumFluctuator(i, document.querySelector(`fluctuator-block:nth-of-type(${i + 1})`), this.fields[i])
            );
        }
    }

    private enableConverter = (index: number) => {
        const max = useStat("max_converters").total.toNumber();

        if (this.activeConverters.includes(index)) {
            this.activeConverters = this.activeConverters.filter(i => i !== index);
        } else {
            this.activeConverters.push(index);
        }
        while (this.activeConverters.length > max) {
            this.activeConverters.shift();
        }

        this.updateConverters();
    }

    private updateConverters() {
        for (let i = 0; i < this.converters.length; i++) {
            this.converters[i].toggle(this.activeConverters.includes(i));
        }

        QuantumUI.updateActiveConverters(this.activeConverters.length);
    }

    private getEnergyCost(): Decimal {
        return new Decimal(useStat("conversion_energy_cost").total).multiply(
            useStat("conversion_energy_scaling").total.pow(this.conversionInput.log10())
        );
    }

    private updateConversionInput() {
        useSave((s) => s.stages.quantum.conversionInput = this.conversionInput);
        this.inputElement.textContent = Numbers.getFormatted(this.conversionInput, 0, { upper: "1e4" });

        for (const converter of this.converters) {
            converter.setInput(this.conversionInput, this.getEnergyCost());
        }
    }

    private updateEnergyCost() {
        const text = Energy.getFormatted(this.getEnergyCost());
        if (text === this.energyCostText) return;
        this.costElement.textContent = text;
        this.energyCostText = text;
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
        this.updateEnergyCost();
        for (const fluctuator of this.fluctuators) {
            fluctuator.update(tickLength, catchingUp);
        }

        for (const converter of this.converters) {
            converter.update(tickLength, catchingUp);
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
