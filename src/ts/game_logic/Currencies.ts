import { ParticleResource, Resource, ParticleColor as Color, ParticleFlavor as Flavor, ParticleType as Type } from "../ui/ResourceGainHandler";
import { BigNumber } from "bignumber.js"

export class Currencies {
    public static particles: ParticleResource[] = [];

    public static initialize() {
        this.particles.push({
            type: Type.Lepton, flavor: Flavor.Electron, amount: new BigNumber(0), reflection: "particle", hash: "leptons-electron"
        });
        this.particles.push({
            type: Type.Lepton, flavor: Flavor.Electron, amount: new BigNumber(0), reflection: "particle", hash: "leptons-muon"
        });
        this.particles.push({
            type: Type.Lepton, flavor: Flavor.Electron, amount: new BigNumber(0), reflection: "particle", hash: "leptons-tau"
        });

        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-red"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-green"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-blue"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-rgb"
        });

        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-red"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-green"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-blue"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-rgb"
        });

        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-red"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-green"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-blue"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-rgb"
        });

        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-red"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-green"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-blue"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-rgb"
        });

        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-red"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-green"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-blue"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-rgb"
        });

        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-red"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-green"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-blue"
        });
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-rgb"
        });
    }

    public static gainResource(resource: Resource) {
        switch (resource.reflection) {
            case "particle":
                let r = resource as ParticleResource;
                let i = this.particles.findIndex(p => p.hash === r.hash);
                if (i > -1) {
                    this.particles[i].amount = r.amount.plus(this.particles[i].amount);
                }
                break;
        }
    }
}
