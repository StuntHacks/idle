import { QuantumFieldElement } from "ui/elements/quantum/QuantumFieldElement";
import { ParticleModel, ParticleType, QuantumStage } from "./Quantum";
import { useSettings } from "utils/SettingsHandler";
import { useSaveHandler } from "SaveHandler/SaveHandler";
import { useStat } from "game_logic/StatHandler";
import { useCurrencyHandler } from "game_logic/currencies/Currencies";
import { UI } from "ui/UI";

interface FieldColor {
    start: string;
    end: string;
    glow: string;
}

export interface FieldModel {
    gradient: string;
    clickDelay: number;
    name: string;
    triple?: boolean;
    thick?: boolean;
    multi?: {
        type: ParticleType;
        flavor?: string | string[];
        color?: string;
        chance?: number;
    };
    subFields: {
        type: ParticleType;
        flavor?: string | string[];
        color?: string;
        fieldColor: FieldColor;
        requirement?: string;
    }[];
}

export class QuantumField {
    private locked: boolean = false;
    private index: number;
    private data: FieldModel;
    private fieldElement: QuantumFieldElement;
    private fieldPosition: DOMRect = new DOMRect();

    private clickDelay: number;
    private lastClick: number = 0;

    private particles: ParticleModel[] = []
    private multiParticle?: ParticleModel;
    private multiChance: number;
    private multiCounter: number = 0;

    private getParticle(): [ParticleModel, index: number] {
        // todo: think about reintroducing multiCounter threshold?
        if (this.multiParticle && this.multiCounter >= 0 && Math.random() < this.multiChance) {
            this.multiCounter = 0;
            return [this.multiParticle, -1];
        }

        this.multiCounter++;
        const index = Math.floor(Math.random() * this.particles.length);
        return [this.particles[index], index];
    }

    public getPosition(): DOMRect {
        return this.fieldPosition;
    }

    private getHashFromParticle(particle: ParticleModel): string {
        let hash = "";
        hash += `${particle.type}s`;

        if (Array.isArray(particle.flavor)) {
            hash += `-${particle.flavor[Math.floor(Math.random() * particle.flavor.length)]}`;
        } else {
            hash += `-${particle.flavor}`;
        }

        if (particle.color) {
            hash += `-${particle.color}`;
        }

        return hash;
    }

    public gainParticle(position: number, catchingUp: boolean = false, click: boolean = false) {
        if (this.locked) return;

        const [particle, index] = this.getParticle();
        const hash = this.getHashFromParticle(particle);
        const amount = QuantumStage.getParticleAmount(particle).multiply(useStat("field_gain").total);

        if (index === -1) { // multi
            // todo: solve this with loop instead
            if (particle.type === "quark") {
                const hashRed = hash.replace("rgb", "red");
                useCurrencyHandler().gain(hashRed, amount);
                const hashGreen = hashRed.replace("red", "green");
                useCurrencyHandler().gain(hashGreen, amount);
                const hashBlue = hashRed.replace("red", "blue");
                useCurrencyHandler().gain(hashBlue, amount);
            } else {
                useCurrencyHandler().gain(hash, amount);
            }
        } else {
            useCurrencyHandler().gain(hash, amount);
        }

        if (!catchingUp) {
            UI.spawnGainElement("quantum-resource-gain-container", hash, amount, position - (click ? 11 : 0), this.fieldPosition.y + (this.fieldPosition.height / 2) - 20);
            if (click || !useSettings().display.settings.stillFields.value) {
                const down = hash.includes("down") || hash.includes("bottom") || hash.includes("minus");
                this.fieldElement.ripple(position, index, down);
            }
        }
    }

    private updatePosition() {
        this.fieldPosition = this.fieldElement?.getBoundingClientRect();
        this.fieldElement.updatePosition();
    }

    public initialize(field: FieldModel, index: number, key?: string) {
        this.index = index;
        this.data = field;
        this.clickDelay = field.clickDelay;
        let subFields = [];

        for (const sub of field.subFields) {
            if (!sub.requirement || useSaveHandler().getFlag(sub.requirement)) {
                this.particles.push({
                    type: sub.type,
                    flavor: sub.flavor,
                    color: sub.color
                });
                subFields.push(sub);
            }
            
            if (sub.requirement) {
                useSaveHandler().registerFlagCallback(sub.requirement, () => {
                    this.initialize(this.data, this.index);
                });
            }
        }

        field.subFields = subFields;
        this.fieldElement = new QuantumFieldElement(field);

        if (key) this.fieldElement.id = `${key}-field`;

        if (index > 1 && !useSaveHandler().getFlag(`quantum.fields.extra${index}`)) {
            this.fieldElement.classList.add("hidden");
            this.fieldElement.style.display = "none";
            this.locked = true;
        }

        if (field.multi) {
            this.multiChance = field.multi.chance ?? 0.1;
            this.multiParticle = {
                type: field.multi.type,
                flavor: field.multi.flavor,
                color: field.multi.color
            };
        }

        this.fieldElement.setClickCallback((position: number) => {
            if (this.clickDelay < 1) return;
            let now = performance.now();
            if ((now - this.lastClick) < this.clickDelay) return;
            this.lastClick = now;
            this.gainParticle(position, false, true);
        });

        document.getElementById("quantum-fields-container").appendChild(this.fieldElement);
        window.addEventListener("resize", this.updatePosition.bind(this));
        setTimeout(this.updatePosition.bind(this), 100);
    }

    constructor(field: FieldModel, index: number, key?: string) {
        this.initialize(field, index, key);
    }
}
