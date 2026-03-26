import Decimal from "break_eternity.js";
import { InferredCurrency as InferredCurrencyClass } from "./InferredCurrency";
import { Energy } from "./inferred/Energy";
import { useSave } from "SaveHandler/SaveHandler";
import currencyData from "../data/currencies.json";
import { Logger } from "utils/Logger";

export class CurrencyHandler {
    private currencyMap = new Map<string, Currency | InferredCurrency>();

    public register(className: string, hash: string) {
        if (this.currencyMap.has(hash)) {
            Logger.warning("Currencies", `"${hash}" already registered`);
            return;
        }
        this.currencyMap.set(hash, { className, amount: new Decimal(0), hash, callbacks: [], inferred: false });
    }

    public registerInferred(hash: string, handler: InferredCurrencyClass) {
        if (this.currencyMap.has(hash)) {
            Logger.warning("Currencies", `"${hash}" already registered`);
            return;
        }
        this.currencyMap.set(hash, { hash, handler, inferred: true });
    }

    public registerCallback(callback: CurrencyCallback | InferredCurrencyCallback, hash: string) {
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

    constructor() {
        for (const { className, hash } of currencyData) {
            this.register(className, hash);
        }

        Energy.initialize(this);
        this.loadFromSave();
    }

    private loadFromSave() {
        const currencies = useSave().currencies;

        for (const c of currencies.normal) {
            this.set(c.hash, new Decimal(c.amount));
        }

        for (const c of currencies.inferred) {
            this.setInferred(c.hash, new Decimal(c.amount));
        }
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

    public spend(hash: string, amount: Decimal): boolean {
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
        currency.handler.setAmount(amount);
    }

    public get(hash: string): Currency | InferredCurrency {
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
export const useCurrency = (hash: string): Currency | InferredCurrency => {
    if (!_instance) throw new Error("Call initCurrencyHandler() first");
    return _instance.get(hash);
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
    callbacks: CurrencyCallback[];
    inferred: false;
}

export interface InferredCurrency {
    hash: string;
    handler: InferredCurrencyClass;
    inferred: true;
}

export type CurrencyCallback = (hash: string, type: "gain" | "spend" | "set", amount: Decimal, before: Decimal, total: Decimal) => void;
export type InferredCurrencyCallback = (hash: string, type: "gain" | "spend" | "set", amount: Decimal, before: Decimal, total: Decimal) => void;
