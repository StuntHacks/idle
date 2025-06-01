import { BigNumber } from "bignumber.js"
import { WaveParticleInfo } from "ui/Wave";
import { Numbers } from "numbers/numbers";
import { InferredCurrency as InferredCurrencyClass } from "./InferredCurrency";
import { Energy } from "./inferred/Energy";
import { SaveHandler } from "SaveHandler/SaveHandler";

export class Currencies {
    private static currencies: Currency[] = [];
    private static inferredCurrencies: InferredCurrency[] = [];
    private static container: HTMLElement;
    private static spawning: boolean = true;
    private static inferredMap: { [key: string]: boolean } = {};

    public static register(className: string, hash: string) {
        this.currencies.push({ className, amount: new BigNumber(0), hash, callbacks: [], inferred: false });
        this.inferredMap[hash] = false;
    }

    public static registerCallback(callback: CurrencyCallback | InferredCurrencyCallback, hash: string) {
        if (this.inferredMap[hash]) {
            this.inferredCurrencies.find((c) => c.hash === hash).handler.registerCallback(callback as InferredCurrencyCallback)
        } else {
            this.currencies.find((c) => c.hash === hash).callbacks.push(callback as CurrencyCallback);
        }
    }

    public static registerInferred(hash: string, handler: InferredCurrencyClass) {
        this.inferredCurrencies.push({ hash, handler, inferred: true });
        this.inferredMap[hash] = true;
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

        this.register("particle boson gluon", "bosons-gluon");
        this.register("particle boson photon", "bosons-photon");
        this.register("particle boson z", "bosons-z");
        this.register("particle boson w-plus", "bosons-w-plus");
        this.register("particle boson w-minus", "bosons-w-minus");
        this.register("particle boson higgs", "bosons-higgs");

        Energy.initialize();

        this.loadFromSave();
    }

    private static loadFromSave() {
        const currencies = SaveHandler.getData().currencies;

        for (const c of currencies.normal) {
            this.set(c.hash, BigNumber(c.amount));
        }

        for (const c of currencies.inferred) {
            this.setInferred(c.hash, BigNumber(c.amount));
        }
    }

    public static toggleSpawning(spawning: boolean = undefined) {
        if (spawning === undefined) {
            this.spawning = !this.spawning;
        } else {
            this.spawning = spawning;
        }
    }

    public static spawnGainElement(hash: string, amount: BigNumber, x: number, y: number, showRipple: boolean = false) {
        if (this.spawning) {
            let element = document.createElement("resource-gain");
            element.setAttribute("x", x + "");
            element.setAttribute("y", y + "");
            element.setAttribute("data-class", this.currencies.find(r => r.hash === hash).className);
            element.setAttribute("amount", Numbers.getFormatted(amount));
            if (showRipple) {
                element.setAttribute("ripple", "true");
            }
            this.container.appendChild(element);
        }
    }

    public static gain(hash: string, amount: BigNumber) {
        const currency = this.currencies.find(r => r.hash === hash);
        if (currency) {
            const before = currency.amount;
            const total = amount.plus(before);
            currency.amount = total;

            for (let callback of currency.callbacks) {
                callback(hash, "gain", amount, before, total);
            }
        }
    }

    public static spend(hash: string, amount: BigNumber): boolean {
        if (this.inferredMap[hash]) {
            return this.inferredCurrencies.find(c => c.hash === hash).handler.spend(amount);
        } else {
            const currency = this.currencies.find(c => c.hash === hash);
            if (currency) {
                if (currency.amount.isGreaterThanOrEqualTo(amount)) {
                    const before = currency.amount;
                    const total = before.minus(amount);
                    currency.amount = total;

                    for (let callback of currency.callbacks) {
                        callback(hash, "spend", amount, before, total);
                    }

                    return true;
                }
            }

            return false;
        }
    }

    public static set(hash: string, amount: BigNumber) {
        const currency = this.currencies.find(r => r.hash === hash);
        if (currency) {
            const before = currency.amount;
            currency.amount = amount;

            for (let callback of currency.callbacks) {
                callback(hash, "set", amount, before, amount);
            }
        }
    }

    public static setInferred(hash: string, amount: BigNumber) {
        const currency = this.inferredCurrencies.find(c => c.hash === hash);
        if (currency) {
            currency.handler.setAmount(amount);
        }
    }

    public static get(hash: string): InferredCurrency | Currency {
        if (this.inferredMap[hash]) {
            return this.inferredCurrencies.find(c => c.hash === hash);
        } else {
            return this.currencies.find(c => c.hash === hash);
        }
    }

    public static getAll(): [Currency[], InferredCurrency[]] {
        return [this.currencies, this.inferredCurrencies];
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
    callbacks: CurrencyCallback[];
    inferred: false;
}

export interface InferredCurrency {
    hash: string;
    handler: InferredCurrencyClass;
    inferred: true;
}

export type CurrencyCallback = (hash: string, type: "gain" | "spend" | "set", amount: BigNumber, before: BigNumber, total: BigNumber) => void;
export type InferredCurrencyCallback = (handler: InferredCurrencyClass, type: "gain" | "spend" | "set", amount: BigNumber, before: BigNumber, total: BigNumber) => void;
