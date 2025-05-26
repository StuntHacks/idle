import { BigNumber } from "bignumber.js"
import { WaveParticleInfo } from "../ui/Wave";
import { Numbers } from "../numbers/numbers";

export class Currencies {
    private static currencies: Currency[] = [];
    public static container: HTMLElement;

    public static register(className: string, hash: string) {
        this.currencies.push({ className, amount: new BigNumber(0), hash });
    }

    public static initialize(id: string = "resource-gain-container") {
        this.container = document.getElementById(id);

        this.register("particle lepton electron", "leptons-electron");
        this.register("particle lepton muon", "leptons-muon");
        this.register("particle lepton tau", "leptons-tau");

        this.register("particle quark up red", "quarks-up-red");
        this.register("particle quark up green", "quarks-up-green");
        this.register("particle quark up blue", "quarks-up-blue");
        this.register("particle quark up rgb", "quarks-up-rgb");

        this.register("particle quark down red", "quarks-down-red");
        this.register("particle quark down green", "quarks-down-green");
        this.register("particle quark down blue", "quarks-down-blue");
        this.register("particle quark down rgb", "quarks-down-rgb");

        this.register("particle quark strange red", "quarks-strange-red");
        this.register("particle quark strange green", "quarks-strange-green");
        this.register("particle quark strange blue", "quarks-strange-blue");
        this.register("particle quark strange rgb", "quarks-strange-rgb");

        this.register("particle quark charm red", "quarks-charm-red");
        this.register("particle quark charm green", "quarks-charm-green");
        this.register("particle quark charm blue", "quarks-charm-blue");
        this.register("particle quark charm rgb", "quarks-charm-rgb");

        this.register("particle quark top red", "quarks-top-red");
        this.register("particle quark top green", "quarks-top-green");
        this.register("particle quark top blue", "quarks-top-blue");
        this.register("particle quark top rgb", "quarks-top-rgb");

        this.register("particle quark bottom red", "quarks-bottom-red");
        this.register("particle quark bottom green", "quarks-bottom-green");
        this.register("particle quark bottom blue", "quarks-bottom-blue");
        this.register("particle quark bottom rgb", "quarks-bottom-rgb");

        this.register("particle gluon", "gluons");
        this.register("particle photon", "photons");
        this.register("particle z-boson", "z-bosons");
        this.register("particle w-plus-boson", "bosons-w-plus");
        this.register("particle w-minus-boson", "bosons-w-minus");
        this.register("particle higgs-boson", "bosons-higgs");
    }

    public static spawnGainElement(hash: string, amount: BigNumber, x: number, y: number) {
        let element = document.createElement("resource-gain");
        element.setAttribute("x", x + "");
        element.setAttribute("y", y + "");
        element.setAttribute("data-class", this.currencies.find(r => r.hash === hash).className);
        element.setAttribute("amount", Numbers.getFormatted(amount));
        this.container.appendChild(element);
    }

    public static gain(hash: string, amount: BigNumber) {
        let i = this.currencies.findIndex(r => r.hash === hash);
        if (i > -1) {
            this.currencies[i].amount = amount.plus(this.currencies[i].amount);
        }
    }

    public static set(hash: string, amount: BigNumber) {
        let i = this.currencies.findIndex(r => r.hash === hash);
        if (i > -1) {
            this.currencies[i].amount = amount;
        }
    }

    public static get(hash: string) {
        return this.currencies.find(r => r.hash === hash);
    }

    public static getFromQuantumField(particle: WaveParticleInfo): string {
        let hash = "";
        let flavor = particle.flavor ? particle.flavor : "";

        switch (particle.type) {
            case "quark":
                hash += "quarks";
                flavor += ["up", "down"][Math.floor(Math.random() * 2)];
                break;
            case "lepton":
                hash += "leptons";
                break;
            case "boson":
                hash += "bosons";
                break;
        }

        if (flavor !== "") {
            hash += `-${flavor}`;
        }

        if (particle.color) {
            hash += `-${particle.color}`;
        }

        return hash;
    }
}

export interface Currency {
    amount: BigNumber;
    className: string;
    hash: string;
}
