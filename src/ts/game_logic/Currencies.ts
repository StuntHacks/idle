import { ParticleResource, Resource, ParticleColor as Color, ParticleFlavor as Flavor, ParticleType as Type } from "../ui/ResourceGainHandler";
import { Currencies as UICurrencies } from "../ui/Currencies"
import { BigNumber } from "bignumber.js"

export class Currencies {
    public static particles: ParticleResource[] = [];

    public static initialize() {
        UICurrencies.registerCurrency("currency-electron", "leptons-electron");
        this.particles.push({
            type: Type.Lepton, flavor: Flavor.Electron, amount: new BigNumber(0), reflection: "particle", hash: "leptons-electron"
        });
        UICurrencies.registerCurrency("currency-muon", "leptons-muon");
        this.particles.push({
            type: Type.Lepton, flavor: Flavor.Electron, amount: new BigNumber(0), reflection: "particle", hash: "leptons-muon"
        });
        UICurrencies.registerCurrency("currency-taus", "leptons-tau");
        this.particles.push({
            type: Type.Lepton, flavor: Flavor.Electron, amount: new BigNumber(0), reflection: "particle", hash: "leptons-tau"
        });

        UICurrencies.registerCurrency("currency-quarks-up-red", "quarks-up-red");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-red"
        });
        UICurrencies.registerCurrency("currency-quarks-up-green", "quarks-up-green");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-green"
        });
        UICurrencies.registerCurrency("currency-quarks-up-blue", "quarks-up-blue");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-blue"
        });
        UICurrencies.registerCurrency("currency-quarks-up-rgb", "quarks-up-rgb");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Up, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-up-rgb"
        });
        UICurrencies.registerCurrency("currency-quarks-up", "quarks-up", [ "quarks-up-red", "quarks-up-green", "quarks-up-blue" ]);

        UICurrencies.registerCurrency("currency-quarks-down-red", "quarks-down-red");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-red"
        });
        UICurrencies.registerCurrency("currency-quarks-down-green", "quarks-down-green");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-green"
        });
        UICurrencies.registerCurrency("currency-quarks-down-blue", "quarks-down-blue");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-blue"
        });
        UICurrencies.registerCurrency("currency-quarks-down-rgb", "quarks-down-rgb");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Down, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-down-rgb"
        });
        UICurrencies.registerCurrency("currency-quarks-down", "quarks-down", [ "quarks-down-red", "quarks-down-green", "quarks-down-blue" ]);

        UICurrencies.registerCurrency("currency-quarks-strange-red", "quarks-strange-red");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-red"
        });
        UICurrencies.registerCurrency("currency-quarks-strange-green", "quarks-strange-green");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-green"
        });
        UICurrencies.registerCurrency("currency-quarks-strange-blue", "quarks-strange-blue");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-blue"
        });
        UICurrencies.registerCurrency("currency-quarks-strange-rgb", "quarks-strange-rgb");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Strange, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-strange-rgb"
        });
        UICurrencies.registerCurrency("currency-quarks-strange", "quarks-strange", [ "quarks-strange-red", "quarks-strange-green", "quarks-strange-blue" ]);

        UICurrencies.registerCurrency("currency-quarks-charm-red", "quarks-charm-red");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-red"
        });
        UICurrencies.registerCurrency("currency-quarks-charm-green", "quarks-charm-green");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-green"
        });
        UICurrencies.registerCurrency("currency-quarks-charm-blue", "quarks-charm-blue");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-blue"
        });
        UICurrencies.registerCurrency("currency-quarks-charm-rgb", "quarks-charm-rgb");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Charm, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-charm-rgb"
        });
        UICurrencies.registerCurrency("currency-quarks-charm", "quarks-charm", [ "quarks-charm-red", "quarks-charm-green", "quarks-charm-blue" ]);

        UICurrencies.registerCurrency("currency-quarks-top-red", "quarks-top-red");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-red"
        });
        UICurrencies.registerCurrency("currency-quarks-top-green", "quarks-top-green");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-green"
        });
        UICurrencies.registerCurrency("currency-quarks-top-blue", "quarks-top-blue");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-blue"
        });
        UICurrencies.registerCurrency("currency-quarks-top-rgb", "quarks-top-rgb");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Top, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-top-rgb"
        });
        UICurrencies.registerCurrency("currency-quarks-top", "quarks-top", [ "quarks-top-red", "quarks-top-green", "quarks-top-blue" ]);

        UICurrencies.registerCurrency("currency-quarks-bottom-red", "quarks-bottom-red");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.Red, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-red"
        });
        UICurrencies.registerCurrency("currency-quarks-bottom-green", "quarks-bottom-green");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.Green, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-green"
        });
        UICurrencies.registerCurrency("currency-quarks-bottom-blue", "quarks-bottom-blue");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.Blue, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-blue"
        });
        UICurrencies.registerCurrency("currency-quarks-bottom-rgb", "quarks-bottom-rgb");
        this.particles.push({
            type: Type.Quark, flavor: Flavor.Bottom, color: Color.RGB, amount: new BigNumber(0), reflection: "particle", hash: "quarks-bottom-rgb"
        });
        UICurrencies.registerCurrency("currency-quarks-bottom", "quarks-bottom", [ "quarks-bottom-red", "quarks-bottom-green", "quarks-bottom-blue" ]);
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
