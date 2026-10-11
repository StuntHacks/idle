import statsData from "./data/stats.json";
import upgradesData from "game_logic/data/upgrades.json";
import { AnyUpgradeDef, ContinuousUpgradeDef, UpgradeDef, SavedContinuousUpgrade } from "types/SaveFile";
import Decimal from "break_eternity.js";
import get from "lodash/get";
import { useFlag, useSaveHandler } from "SaveHandler/SaveHandler";
import { Logger } from "utils/Logger";
import { Cost, CurrencyHandler, useCurrencyHandler } from "./currencies/Currencies";
import { curves } from "./CurveFunctions";

const stats = statsData as StatData;

class StatHandler {
    private stats: Stats = {};

    public getUpgradeDef(namespace: string, id: string): AnyUpgradeDef | null {
        const list: AnyUpgradeDef[] | undefined = get(upgradesData, namespace);
        if (!Array.isArray(list)) return null;
        return list.find((u) => u.id === id) ?? null;
    }

    public getUpgradeLevel(id: string): number {
        return useSaveHandler().getUpgrades().find((u) => u.id === id)?.levels ?? 0;
    }

    public update(stat: string) {
        if (!this.stats[stat]) {
            Logger.error("StatHandler", `Unknown stat "${stat}"`);
            return;
        }

        const save = useSaveHandler();
        const savedUpgrades = save.getUpgrades();
        const savedContinuous = save.getContinuousUpgrades();

        const relevant = savedUpgrades.flatMap((saved) => {
            const def = this.getUpgradeDef(saved.accessor, saved.id);
            return def?.target === stat && !def.continuous ? [{ saved, def: def as UpgradeDef }] : [];
        });

        const relevantContinuous = savedContinuous.flatMap((saved) => {
            const def = this.getUpgradeDef(saved.accessor, saved.id);
            return def?.target === stat && def.continuous ? [{ saved: saved as SavedContinuousUpgrade, def: def as ContinuousUpgradeDef }] : [];
        });

        let additive = new Decimal(0);
        let multiplicative = new Decimal(1);
        let additiveMultiplicativeSum = new Decimal(0);
        let continuousAdditive = new Decimal(0);
        let continuousMultiplicative = new Decimal(1);
        let continuousAdditiveMultiplicativeSum = new Decimal(0);

        for (const { saved, def } of relevant) {
            if (def.amount == null) {
                Logger.warning("StatHandler", `Upgrade "${def.id}" has no amount!`);
                continue;
            }

            switch (def.type) {
                case "additive":
                    additive = additive.plus(def.amount * saved.levels);
                    break;
                case "multiplicative":
                    multiplicative = multiplicative.multiply(new Decimal(def.amount).pow(saved.levels));
                    break;
                case "additive_multiplicative":
                    additiveMultiplicativeSum = additiveMultiplicativeSum.plus(def.amount * saved.levels);
                    break;
            }
        }

        for (const { saved, def } of relevantContinuous) {
            const curveFn = curves[def.curve];
            if (!curveFn) {
                Logger.warning("StatHandler", `Unknown curve "${def.curve}" on "${def.id}"`);
                continue;
            }

            const bonus = curveFn(saved.spent, def.scale);

            switch (def.type) {
                case "additive":
                    continuousAdditive = continuousAdditive.plus(bonus);
                    break;
                case "multiplicative":
                    continuousMultiplicative = continuousMultiplicative.multiply(bonus);
                    break;
                case "additive_multiplicative":
                    continuousAdditiveMultiplicativeSum = continuousAdditiveMultiplicativeSum.plus(bonus.minus(1));
                    break;
            }
        }

        const additiveMultiplicative = new Decimal(1).plus(additiveMultiplicativeSum);
        const continuousAdditiveMultiplicative = new Decimal(1).plus(continuousAdditiveMultiplicativeSum);

        const def = stats[stat];
        this.stats[stat] = {
            base: def.base,
            title: def.title,
            additive,
            multiplicative,
            additiveMultiplicative,
            continuousMultiplicative,
            total: new Decimal(def.base)
                .plus(additive)
                .plus(continuousAdditive)
                .multiply(multiplicative)
                .multiply(additiveMultiplicative)
                .multiply(continuousMultiplicative)
                .multiply(continuousAdditiveMultiplicative),
            icon: def.icon,
        };
    }

    public calculateCost(def: UpgradeDef, currentLevel: number, amount: number): Cost[] {
        const scaling = new Decimal(def.costScaling ?? 1);
        const factor = scaling.eq(1)
            ? new Decimal(amount)
            : scaling.pow(currentLevel)
                .multiply(scaling.pow(amount).minus(1))
                .divide(scaling.minus(1));

        return def.cost.map(({ currency, amount }) => ({ currency, amount: factor.multiply(amount) }));
    }

    private static parseUpgrades(data: unknown) {
        if (Array.isArray(data)) {
            for (const entry of data) {
                StatHandler.parseUpgrades(entry);
            }
            return;
        }

        if (typeof data !== "object" || data === null) return;

        const def = data as Partial<UpgradeDef>;
        if (!Array.isArray(def.cost)) {
            for (const value of Object.values(data)) {
                StatHandler.parseUpgrades(value);
            }
            return;
        }

        const costs = def.cost.map(({ currency, amount }) => ({ currency, amount: new Decimal(amount) }));
        def.cost = CurrencyHandler.mergeCosts(costs);
        if (def.cost.length !== costs.length) {
            Logger.warning("StatHandler", `Double currency in "${def.id}"`);
        }
    }

    public getUpgradeEffect(def: UpgradeDef, currentLevel: number): Decimal | null {
        if (def.amount == null || currentLevel === 0) return null;

        switch (def.type) {
            case "additive":
                return new Decimal(def.amount * currentLevel);
            case "multiplicative":
                return new Decimal(def.amount).pow(currentLevel);
            case "additive_multiplicative":
                return new Decimal(1).plus(def.amount * currentLevel);
            case "flag":
                return null;
        }
    }

    public feed(namespace: string, id: string, amount: Decimal): void {
        const def = this.getUpgradeDef(namespace, id);
        if (!def?.continuous) {
            Logger.error("StatHandler", `"${id}" is not a continuous upgrade`);
            return;
        }

        const saved = useSaveHandler().getContinuousUpgrades();
        const index = saved.findIndex((u) => u.id === id);

        if (index === -1) {
            saved.push({ id, accessor: namespace, spent: amount });
        } else {
            saved[index].spent = saved[index].spent.plus(amount);
        }

        this.update(def.target);
    }

    public getContinuousEffect(namespace: string, id: string, additional: Decimal = new Decimal(0)): Decimal | null {
        const def = this.getUpgradeDef(namespace, id);
        if (!def?.continuous) return null;

        const curveFn = curves[def.curve];
        if (!curveFn) return null;

        const saved = useSaveHandler().getContinuousUpgrades().find((u) => u.id === id);
        const spent = saved?.spent ?? new Decimal(0);
        return curveFn(spent.plus(additional), def.scale);
    }

    public gainUpgrade(
        namespace: string,
        id: string,
        purchase: boolean = false,
        amount: number = 1
    ): boolean {
        const def = this.getUpgradeDef(namespace, id);
        if (!def) {
            Logger.error("StatHandler", `Upgrade "${id}" not found in "${namespace}"`);
            return false;
        }

        if (def.continuous) {
            Logger.error("StatHandler", `"${id}" is continuous`);
            return false;
        }

        const normalDef = def as UpgradeDef;

        if (normalDef.type === "flag") {
            if (purchase && !useCurrencyHandler().spend(this.calculateCost(normalDef, 0, 1))) {
                return false;
            }
            useFlag(normalDef.target, true);
            return true;
        }

        const saveHandler = useSaveHandler();
        const savedUpgrades = saveHandler.getUpgrades();
        const index = savedUpgrades.findIndex((u) => u.id === id);
        const existing = index > -1 ? savedUpgrades[index] : null;

        if (existing && !normalDef.levels) return false;

        const currentLevel = existing ? existing.levels : 0;

        if (normalDef.levels && currentLevel >= normalDef.levels) return false;

        const levelsRemaining = normalDef.levels ? normalDef.levels - currentLevel : amount;
        const actualAmount = Math.min(amount, levelsRemaining);
        const cost = this.calculateCost(normalDef, currentLevel, actualAmount);

        if (purchase && !useCurrencyHandler().spend(cost)) return false;

        if (!existing) {
            savedUpgrades.push({ id: normalDef.id, accessor: namespace, levels: actualAmount });
        } else {
            savedUpgrades[index].levels = currentLevel + actualAmount;
        }

        this.update(normalDef.target);
        return true;
    }

    constructor() {
        StatHandler.parseUpgrades(upgradesData);

        for (const stat in stats) {
            const def = stats[stat];
            this.stats[stat] = {
                base: def.base,
                title: def.title,
                additive: new Decimal(0),
                multiplicative: new Decimal(1),
                additiveMultiplicative: new Decimal(1),
                continuousMultiplicative: new Decimal(1),
                total: new Decimal(def.base),
                icon: def.icon,
            };
            this.update(stat);
        }
    }

    public get(stat: string): Stat {
        return this.stats[stat];
    }
}

let _instance: StatHandler;
export const useStat = (stat: string): Stat => {
    if (!_instance) throw new Error("Call initStatHandler() first");
    return _instance.get(stat);
};
export const useStatHandler = (): StatHandler => {
    if (!_instance) throw new Error("Call initStatHandler() first");
    return _instance;
};
export const initStatHandler = (): StatHandler => {
    _instance = new StatHandler();
    return _instance;
};

export interface Stats {
    [key: string]: Stat;
}

export interface Stat {
    base: number;
    title: string;
    additive: Decimal;
    multiplicative: Decimal;
    additiveMultiplicative: Decimal;
    continuousMultiplicative: Decimal;
    total: Decimal;
    icon?: string;
}

interface StatData {
    [key: string]: StatDef;
}

interface StatDef {
    base: number;
    title: string;
    icon?: string;
}
