import statsData from "./data/stats.json";
import upgradesData from "game_logic/data/upgrades.json";
import { AnyUpgradeDef, ContinuousUpgradeDef, UpgradeDef, SavedUpgrade, SavedContinuousUpgrade } from "types/SaveFile";
import Decimal from "break_eternity.js";
import _ from "lodash";
import { useFlag, useSaveHandler } from "SaveHandler/SaveHandler";
import { Logger } from "utils/Logger";
import { useCurrencyHandler } from "./currencies/Currencies";
import { curves } from "./CurveFunctions";

const stats = statsData as StatData;

class StatHandler {
    private stats: Stats = {};

    private getUpgradeDef(saved: SavedUpgrade | SavedContinuousUpgrade): AnyUpgradeDef | null {
        const list: AnyUpgradeDef[] | undefined = _.get(upgradesData, saved.accessor);
        if (!Array.isArray(list)) return null;
        return list.find((u) => u.id === saved.id) ?? null;
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
            const def = this.getUpgradeDef(saved);
            return def?.target === stat && !def.continuous ? [{ saved, def: def as UpgradeDef }] : [];
        });

        const relevantContinuous = savedContinuous.flatMap((saved) => {
            const def = this.getUpgradeDef(saved);
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

            const bonus = curveFn(new Decimal(saved.spent), def.scale);

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
        };
    }

    public calculateCost(def: UpgradeDef, currentLevel: number, amount: number): Decimal {
        const scaling = def.costScaling ?? 1;
        if (scaling === 1) {
            return new Decimal(def.cost * amount);
        }
        return new Decimal(def.cost)
            .multiply(scaling ** currentLevel)
            .multiply(1 - scaling ** amount)
            .divide(1 - scaling);
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
        const defList: AnyUpgradeDef[] | undefined = _.get(upgradesData, namespace);
        if (!Array.isArray(defList)) {
            Logger.error("StatHandler", `Invalid namespace "${namespace}"`);
            return;
        }

        const def = defList.find((u) => u.id === id);
        if (!def?.continuous) {
            Logger.error("StatHandler", `"${id}" is not a continuous upgrade`);
            return;
        }

        const saved = useSaveHandler().getContinuousUpgrades();
        const index = saved.findIndex((u) => u.id === id);

        if (index === -1) {
            saved.push({ id, accessor: namespace, spent: amount });
        } else {
            saved[index].spent = new Decimal(saved[index].spent).plus(amount);
        }

        this.update(def.target);
    }

    public getContinuousEffect(namespace: string, id: string): Decimal | null {
        const defList: AnyUpgradeDef[] | undefined = _.get(upgradesData, namespace);
        const def = defList?.find((u) => u.id === id) as ContinuousUpgradeDef | undefined;
        if (!def?.continuous) return null;

        const curveFn = curves[def.curve];
        if (!curveFn) return null;

        const saved = useSaveHandler().getContinuousUpgrades().find((u) => u.id === id);
        const spent = saved ? new Decimal(saved.spent) : new Decimal(0);
        return curveFn(spent, def.scale);
    }

    public gainUpgrade(
        namespace: string,
        id: string,
        purchase: boolean = false,
        amount: number = 1
    ): boolean {
        const defList: AnyUpgradeDef[] | undefined = _.get(upgradesData, namespace);
        if (!Array.isArray(defList)) {
            Logger.error("StatHandler", `Invalid namespace "${namespace}"`);
            return false;
        }

        const def = defList.find((u) => u.id === id);
        if (!def) {
            Logger.error("StatHandler", `Upgrade "${id}" not found in "${namespace}"`);
            return false;
        }

        if (def.continuous) {
            Logger.error("StatHandler", `"${id}" is continuous - use feed() instead`);
            return false;
        }

        const normalDef = def as UpgradeDef;

        if (normalDef.type === "flag") {
            if (purchase && !useCurrencyHandler().spend(normalDef.currency, new Decimal(normalDef.cost))) {
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

        if (purchase && !useCurrencyHandler().spend(normalDef.currency, cost)) return false;

        if (!existing) {
            savedUpgrades.push({ id: normalDef.id, accessor: namespace, levels: actualAmount });
        } else {
            savedUpgrades[index].levels = currentLevel + actualAmount;
        }

        this.update(normalDef.target);
        return true;
    }

    constructor() {
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
}

interface StatData {
    [key: string]: StatDef;
}

interface StatDef {
    base: number;
    title: string;
}