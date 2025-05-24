import { Currencies } from "../game_logic/Currencies";
import { Numbers } from "../numbers/numbers";
import { Utils } from "../utils/utils";
import { WaveParticleInfo } from "./Wave";

export class ResourceGainHandler {
    public static container: HTMLElement;

    public static initialize(id: string = "resource-gain-container") {
        this.container = document.getElementById(id);
    }

    public static gainResource(resource: Resource, x: number, y: number) {
        let element = document.createElement("resource-gain");
        element.setAttribute("x", x + "");
        element.setAttribute("y", y + "");

        if (resource.reflection === "particle") {
            let r = resource as ParticleResource;

            if (r.type) {
                element.setAttribute("type", r.type.toString());
            }
            if (r.color) {
                element.setAttribute("color", r.color.toString());
            }
            if (r.flavor) {
                element.setAttribute("flavor", r.flavor.toString());
            }
        }

        element.setAttribute("amount", Numbers.getFormatted(resource.amount));
        this.container.appendChild(element);

        Currencies.gainResource(resource);
    }

    public static getParticleResourceFromField(particle: WaveParticleInfo, amount: BigNumber): ParticleResource {
        let flavor = ParticleFlavor[particle.flavor as keyof typeof ParticleFlavor];
        let color = ParticleColor[particle.color as keyof typeof ParticleColor];
        let type = ParticleType[particle.type as keyof typeof ParticleType];

        if (particle.type === "Quark") {
            flavor = [ParticleFlavor.Up, ParticleFlavor.Down][Math.floor(Math.random() * 2)];
        }

        let hash = `${type}-${flavor}`;
        if (color) {
            hash += `-${color}`;
        }
        
        return { amount, type, flavor, color, reflection: "particle", hash }
    }
}

export interface Resource {
    amount: BigNumber;
    reflection: "particle";
    hash: string;
}

export interface ParticleResource extends Resource{
    type: ParticleType;
    flavor: ParticleFlavor;
    color?: ParticleColor;
}

export enum ParticleType {
    Quark = "quarks",
    Lepton = "leptons",
    Boson = "bosons",
}

export enum ParticleFlavor {
    Electron = "electron",
    Muon = "muon",
    Tau = "tau",
    Up = "up",
    Down = "down",
    Strange = "stange",
    Charm = "charm",
    Top = "top",
    Bottom = "bottom",
    Gluon = "gluon",
    Photon = "photon",
    WPlus = "w-plus",
    WMinus = "w-minus",
    Z = "z",
    Higgs = "higgs",
}

export enum ParticleColor {
    Red = "red",
    Green = "green",
    Blue = "blue",
    RGB = "rgb",
}
