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

        if (resource.type) {
            element.setAttribute("type", resource.type.toString());
        }
        if (resource.color) {
            element.setAttribute("color", resource.color.toString());
        }
        if (resource.flavor) {
            element.setAttribute("flavor", resource.flavor.toString());
        }

        element.setAttribute("amount", "1.34e17");
        this.container.appendChild(element);
    }

    public static getResourceFromField(particle: WaveParticleInfo): Resource {
        let flavor = ParticleFlavor[particle.flavor as keyof typeof ParticleFlavor];
        let color = ParticleColor[particle.color as keyof typeof ParticleColor];
        let type = ParticleType[particle.type as keyof typeof ParticleType];

        if (particle.type === "Quark") {
            return {
                type,
                color,
                flavor: [ParticleFlavor.Up, ParticleFlavor.Down][Math.floor(Math.random() * 2)]
            }
        }
        
        return { type, flavor, color }
    }
}

export interface Resource {
    type: ParticleType;
    flavor: ParticleFlavor;
    color?: ParticleColor;
}

enum ParticleType {
    Quark = "quark",
    Lepton = "lepton",
    Boson = "boson",
}

enum ParticleFlavor {
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

enum ParticleColor {
    Red = "red",
    Green = "green",
    Blue = "blue",
    RGB = "rgb",
}
