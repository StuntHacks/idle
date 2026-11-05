import Decimal, { DecimalSource } from "break_eternity.js";
import { Logger } from "utils/Logger";

export interface QuarkFilter {
    flavors?: string[];
    colors?: string[];
}

export interface QuarkCost {
    filter: QuarkFilter;
    amount: DecimalSource;
}

export type QuarkCallback = (hash: string, type: "gain" | "spend" | "set", amount: Decimal, before: Decimal, total: Decimal) => void;

export interface QuarkStore {
    getAmount(hash: string): Decimal;
    spend(hash: string, amount: Decimal): boolean;
    registerCallback(hash: string, callback: QuarkCallback): void;
}

export class QuarkPool {
    public static readonly COLORS = ["red", "green", "blue"];
    private store: QuarkStore;
    private flavors: string[];
    private unlockedFlavors: string[];

    public static getHash(flavor: string, color: string): string {
        return `quarks-${flavor}-${color}`;
    }

    public static getTripletCost(amount: DecimalSource): QuarkCost[] {
        return QuarkPool.COLORS.map((color) => ({ filter: { colors: [color] }, amount }));
    }

    constructor(store: QuarkStore, flavors: string[], initialFlavors: string[]) {
        this.store = store;
        this.flavors = [...flavors];
        this.unlockedFlavors = [...initialFlavors];
    }

    public unlockFlavor(flavor: string) {
        if (!this.unlockedFlavors.includes(flavor)) this.unlockedFlavors.push(flavor);
    }

    public lockFlavor(flavor: string) {
        this.unlockedFlavors = this.unlockedFlavors.filter((f) => f !== flavor);
    }

    public getCombinations(filter: QuarkFilter, includeLocked: boolean = false): string[] {
        const flavors = filter.flavors ?? (includeLocked ? this.flavors : this.unlockedFlavors);
        const colors = filter.colors ?? QuarkPool.COLORS;
        return flavors.flatMap((flavor) => colors.map((color) => QuarkPool.getHash(flavor, color)));
    }

    public available(filter: QuarkFilter): Decimal {
        return this.getCombinations(filter).reduce((sum, hash) => sum.plus(this.store.getAmount(hash)), new Decimal(0));
    }

    public getTriplets(): Decimal {
        return QuarkPool.COLORS
            .map((color) => this.available({ colors: [color] }))
            .reduce((min, amount) => Decimal.min(min, amount));
    }

    public canAfford(cost: QuarkCost[]): boolean {
        const checkValidity = (cost: QuarkCost[]) => {
            if (cost.length < 2) return true;

            const costs = new Set<string>();
            for (const part of cost) {
                for (const hash of this.getCombinations(part.filter, true)) {
                    if (costs.has(hash)) {
                        Logger.warning("QuarkPool", `Overlapping quark costs ${hash}`);
                        return false;
                    }
                    costs.add(hash);
                }
            }

            return true;
        }

        return checkValidity(cost) ? cost.every((part) => this.available(part.filter).gte(part.amount)) : false;
    }

    public spend(cost: QuarkCost[]): boolean {
        if (!this.canAfford(cost)) return false;
        for (const part of cost) {
            this.spendProportionally(this.getCombinations(part.filter), new Decimal(part.amount));
        }
        return true;
    }

    private spendProportionally(hashes: string[], amount: Decimal) {
        const pools = hashes
            .map((hash) => ({ hash, held: this.store.getAmount(hash), take: new Decimal(0), remainder: new Decimal(0) }))
            .filter((h) => h.held.gt(0));
        const total = pools.reduce((sum, h) => sum.plus(h.held), new Decimal(0));
        if (amount.lte(0) || total.lte(0)) return;

        let left = amount;
        for (const pool of pools) {
            const exact = amount.multiply(pool.held).divide(total);
            pool.take = exact.floor();
            pool.remainder = exact.minus(pool.take);
            left = left.minus(pool.take);
        }

        pools.sort((a, b) => b.remainder.cmp(a.remainder) || b.held.cmp(a.held));
        for (const pool of pools) {
            if (left.lt(1)) break;
            if (pool.take.plus(1).lte(pool.held)) {
                pool.take = pool.take.plus(1);
                left = left.minus(1);
            }
        }

        if (left.gt(0)) {
            pools.sort((a, b) => b.held.minus(b.take).cmp(a.held.minus(a.take)));
            for (const pool of pools) {
                if (left.lte(0)) break;
                const extra = Decimal.min(left, pool.held.minus(pool.take));
                pool.take = pool.take.plus(extra);
                left = left.minus(extra);
            }
        }

        for (const pool of pools) {
            if (pool.take.gt(0)) this.store.spend(pool.hash, pool.take);
        }
    }

    public registerCallback(filter: QuarkFilter, callback: QuarkCallback) {
        for (const hash of this.getCombinations(filter, true)) {
            this.store.registerCallback(hash, callback);
        }
    }
}
