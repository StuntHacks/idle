import Decimal from "break_eternity.js";
import { InferredCurrency as InferredCurrencyClass } from "./InferredCurrency";
import { Energy } from "./inferred/Energy";
import { useSave } from "SaveHandler/SaveHandler";
import currencyData from "../data/currencies.json";
import { Logger } from "utils/Logger";
import { OfflineResults } from "game_logic/Game";
import { useSettings } from "utils/SettingsHandler";
import { QuarkAggregate, QuarkTriplets } from "./inferred/QuarkAggregate";
import { QuarkFilter, QuarkPool } from "./QuarkPool";

const FLAVORS = currencyData.quarkFlavors;

export type QuarkCurrency = { quarks: QuarkFilter[] };
export type CostCurrency = string | QuarkCurrency;

export class CurrencyHandler {
    private currencyMap = new Map<string, Currency | InferredCurrency>();
    public readonly quarks: QuarkPool;

    public constructor() {
        for (const { className, hash, stage, group, important } of currencyData.normal) {
            this.register(className, hash, stage, group, important);
        }

        this.quarks = new QuarkPool({
            getAmount: (hash) => (this.currencyMap.get(hash) as Currency | undefined)?.amount ?? new Decimal(0),
            spend: (hash, amount) => this.spend(hash, amount),
            registerCallback: (hash, callback) => this.registerCallback(callback, hash),
        }, FLAVORS, currencyData.initialFlavors);

        Energy.initialize(this);
        this.initializeQuarks();
        this.loadFromSave();
    }

    private initializeQuarks() {
        const aggregates: [string, QuarkAggregate][] = [
            ...FLAVORS.map((flavor): [string, QuarkAggregate] =>
                [`quarks-${flavor}`, new QuarkAggregate(`quarks-${flavor}`, this.quarks, { flavors: [flavor] })]),
            ...QuarkPool.COLORS.map((color): [string, QuarkAggregate] =>
                [`quarks-${color}`, new QuarkAggregate(`quarks-${color}`, this.quarks, { colors: [color] })]),
            ["quarks-total", new QuarkAggregate("quarks-total", this.quarks, {})],
            ["quarks-triplets", new QuarkTriplets("quarks-triplets", this.quarks)],
        ];

        for (const [hash, instance] of aggregates) {
            const entry = currencyData.inferred.find(c => c.hash === hash);
            if (entry) {
                this.registerInferred(hash, instance, entry.stage, entry.group, entry.important ?? false);
            }
        }
    }

    public unlockQuarkFlavor(flavor: string) {
        this.quarks.unlockFlavor(flavor);
    }

    public lockQuarkFlavor(flavor: string) {
        this.quarks.lockFlavor(flavor);
    }

    public canAfford(currency: CostCurrency, amount: Decimal): boolean {
        if (typeof currency !== "string") {
            return this.quarks.canAfford(currency.quarks.map((filter) => ({ filter, amount })));
        }
        const c = this.get(currency);
        if (!c) return false;
        return c.inferred ? c.handler.canSpend(amount) : c.amount.gte(amount);
    }

    public register(className: string, hash: string, stage: string, group: string, important: boolean = false) {
        if (this.currencyMap.has(hash)) {
            Logger.warning("Currencies", `"${hash}" already registered`);
            return;
        }
        this.currencyMap.set(hash, { className, amount: new Decimal(0), hash, stage, group, important, callbacks: [], inferred: false });
    }

    public registerInferred(hash: string, handler: InferredCurrencyClass, stage: string, group: string, important: boolean = false) {
        if (this.currencyMap.has(hash)) {
            Logger.warning("Currencies", `"${hash}" already registered`);
            return;
        }
        this.currencyMap.set(hash, { hash, handler, stage, group, important, inferred: true });
    }

    public registerCallback(callback: CurrencyCallback | InferredCurrencyCallback, cost: CostCurrency) {
        if (typeof cost !== "string") {
            for (const filter of cost.quarks) {
                this.quarks.registerCallback(filter, callback);
            }
            return;
        }

        const hash = cost;
        const currency = this.currencyMap.get(hash);
        if (!currency) {
            Logger.warning("Currencies", `Unknown hash "${hash}"`);
            return;
        }
        if (currency.inferred) {
            (currency as InferredCurrency).handler.registerCallback(callback as InferredCurrencyCallback);
        } else {
            (currency as Currency).callbacks.push(callback as CurrencyCallback);
        }
    }

    private loadFromSave() {
        const currencies = useSave().currencies;

        for (const c of currencies.normal) {
            this.set(c.hash, c.amount);
        }

        for (const c of currencies.inferred) {
            this.setInferred(c.hash, c.amount);
        }
    }

    public snapshot(): Map<string, Decimal> {
        const snap = new Map<string, Decimal>();
        for (const [hash, currency] of this.currencyMap) {
            const amount = currency.inferred
                ? (currency as InferredCurrency).handler.getAmount()
                : (currency as Currency).amount;
            snap.set(hash, amount);
        }
        return snap;
    }

    public diff(snapshot: Map<string, Decimal>): OfflineResults {
        const results: OfflineResults = {};

        for (const [hash, currency] of this.currencyMap) {
            const before = snapshot.get(hash) ?? new Decimal(0);
            const after = currency.inferred
                ? (currency as InferredCurrency).handler.getAmount()
                : (currency as Currency).amount;

            const gained = after.minus(before);
            if (gained.lte(0)) continue;

            const { stage, group } = currency;
            if (!results[stage]) results[stage] = {};
            if (!results[stage][group]) results[stage][group] = [];
            if (currency.important || useSettings().gameplay.settings.detailedOfflineProgress?.value) {
                results[stage][group].push({ hash, amount: gained });
            }
        }

        return results;
    }

    public gain(hash: string, amount: Decimal) {
        const currency = this.currencyMap.get(hash) as Currency | undefined;
        if (!currency || currency.inferred) {
            Logger.warning("Currencies", `Unknown or inferred hash "${hash}"`);
            return;
        }

        const before = currency.amount;
        const total = before.plus(amount);
        currency.amount = total;

        for (const callback of currency.callbacks) {
            callback(hash, "gain", amount, before, total);
        }
    }

    public spend(cost: CostCurrency, amount: Decimal): boolean {
        if (typeof cost !== "string") {
            return this.quarks.spend(cost.quarks.map((filter) => ({ filter, amount })));
        }

        const hash = cost;
        const currency = this.currencyMap.get(hash);
        if (!currency) {
            Logger.warning("Currencies", `Unknown hash "${hash}"`);
            return false;
        }

        if (currency.inferred) {
            return (currency as InferredCurrency).handler.spend(amount);
        }

        const normal = currency as Currency;
        if (!normal.amount.greaterThanOrEqualTo(amount)) return false;

        const before = normal.amount;
        const total = before.minus(amount);
        normal.amount = total;

        for (const callback of normal.callbacks) {
            callback(hash, "spend", amount, before, total);
        }

        return true;
    }

    public set(hash: string, amount: Decimal) {
        const currency = this.currencyMap.get(hash) as Currency | undefined;
        if (!currency || currency.inferred) {
            Logger.warning("Currencies", `Unknown or inferred hash "${hash}"`);
            return;
        }

        const before = currency.amount;
        currency.amount = amount;

        for (const callback of currency.callbacks) {
            callback(hash, "set", amount, before, amount);
        }
    }

    public setInferred(hash: string, amount: Decimal) {
        const currency = this.currencyMap.get(hash) as InferredCurrency | undefined;
        if (!currency || !currency.inferred) {
            Logger.warning("Currencies", `Unknown or non-inferred hash "${hash}"`);
            return;
        }
        if (!currency.handler.isPersisted) return;
        currency.handler.setAmount(amount);
    }

    public get(hash: string): Currency | InferredCurrency | undefined {
        const currency = this.currencyMap.get(hash);
        if (!currency) {
            Logger.warning("Currencies", `Unknown hash "${hash}"`);
            return undefined;
        }
        return currency;
    }

    public getAll(): [Currency[], InferredCurrency[]] {
        const normal: Currency[] = [];
        const inferred: InferredCurrency[] = [];
        for (const currency of this.currencyMap.values()) {
            if (currency.inferred) {
                inferred.push(currency as InferredCurrency);
            } else {
                normal.push(currency as Currency);
            }
        }
        return [normal, inferred];
    }
}

let _instance: CurrencyHandler;
export const useInferredCurrency = <T extends InferredCurrencyClass>(hash: string): T => {
    const wrapper = useCurrencyHandler().get(hash);
    if (!wrapper?.inferred) {
        throw new Error(`"${hash}" is not an inferred currency`);
    }
    return wrapper.handler as unknown as T;
};
export const useCurrency = (hash: string): Currency | InferredCurrency | undefined => {
    if (!_instance) throw new Error("Call initCurrencyHandler() first");
    return _instance.get(hash);
};
export const useQuarkPool = (): QuarkPool => {
    return useCurrencyHandler().quarks;
};
export const useCurrencyHandler = (): CurrencyHandler => {
    if (!_instance) throw new Error("Call initCurrencyHandler() first");
    return _instance;
};
export const initCurrencyHandler = (): CurrencyHandler => {
    _instance = new CurrencyHandler();
    return _instance;
};

export interface Currency {
    amount: Decimal;
    className: string;
    hash: string;
    stage: string;
    group: string;
    important?: boolean;
    callbacks: CurrencyCallback[];
    inferred: false;
}

export interface InferredCurrency {
    hash: string;
    handler: InferredCurrencyClass;
    stage: string;
    group: string;
    important?: boolean;
    inferred: true;
}

export type CurrencyCallback = (hash: string, type: "gain" | "spend" | "set", amount: Decimal, before: Decimal, total: Decimal) => void;
export type InferredCurrencyCallback = (hash: string, type: "gain" | "spend" | "set", amount: Decimal, before: Decimal, total: Decimal) => void;
