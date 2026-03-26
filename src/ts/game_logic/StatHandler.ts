import statsData from "./data/stats.json";
import upgradesData from "game_logic/data/upgrades.json";
import { UpgradeDef, SavedUpgrade } from "types/SaveFile";
import Decimal from "break_eternity.js";
import _ from "lodash";
import { useSaveHandler } from "SaveHandler/SaveHandler";
import { Logger } from "utils/Logger";
import { useCurrencyHandler } from "./currencies/Currencies";

const stats = statsData as StatData;

class StatHandler {
    private stats: Stats = {};

    private getUpgradeDef(saved: SavedUpgrade): UpgradeDef | null {
        const list: UpgradeDef[] | undefined = _.get(upgradesData, saved.accessor);
        if (!Array.isArray(list)) return null;
        return list.find((u) => u.id === saved.id) ?? null;
    }

    public update(stat: string) {
        if (!this.stats[stat]) {
            Logger.error("StatHandler", `Unknown stat "${stat}"`);
            return;
        }

        const savedUpgrades = useSaveHandler().getUpgrades();
        const relevant = savedUpgrades.flatMap((saved) => {
            const def = this.getUpgradeDef(saved);
            return def?.target === stat ? [{ saved, def }] : [];
        });

        let additive = new Decimal(0);
        let multiplicative = new Decimal(1);
        let additiveMultiplicativeSum = new Decimal(0);

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
                    multiplicative = multiplicative.multiply(
                        new Decimal(def.amount).pow(saved.levels)
                    );
                    break;

                case "additive_multiplicative":
                    additiveMultiplicativeSum = additiveMultiplicativeSum.plus(
                        def.amount * saved.levels
                    );
                    break;
            }
        }

        const additiveMultiplicative = new Decimal(1).plus(additiveMultiplicativeSum);

        this.stats[stat] = {
            ...this.stats[stat],
            additive,
            multiplicative,
            additiveMultiplicative,
            total: new Decimal(this.stats[stat].base)
                .plus(additive)
                .multiply(multiplicative)
                .multiply(additiveMultiplicative),
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

    public gainUpgrade(
        namespace: string,
        id: string,
        purchase: boolean = false,
        amount: number = 1
    ): boolean {
        const defList: UpgradeDef[] | undefined = _.get(upgradesData, namespace);
        if (!Array.isArray(defList)) {
            Logger.error("StatHandler", `Invalid namespace "${namespace}"`);
            return false;
        }

        const def = defList.find((u) => u.id === id);
        if (!def) {
            Logger.error("StatHandler", `Upgrade "${id}" not found in "${namespace}"`);
            return false;
        }

        if (def.type === "flag") {
            if (purchase && !useCurrencyHandler().spend(def.currency, new Decimal(def.cost))) {
                return false;
            }
            useSaveHandler().setFlag(def.target, true);
            return true;
        }

        const saveHandler = useSaveHandler();
        const savedUpgrades = saveHandler.getUpgrades();
        const index = savedUpgrades.findIndex((u) => u.id === id);
        const existing = index > -1 ? savedUpgrades[index] : null;

        if (existing && !def.levels) {
            return false;
        }

        const currentLevel = existing ? existing.levels : 0;

        if (def.levels && currentLevel >= def.levels) {
            return false;
        }

        const levelsRemaining = def.levels ? def.levels - currentLevel : amount;
        const actualAmount = Math.min(amount, levelsRemaining);

        const cost = this.calculateCost(def, currentLevel, actualAmount);

        if (purchase && !useCurrencyHandler().spend(def.currency, cost)) {
            return false;
        }

        if (!existing) {
            savedUpgrades.push({
                id: def.id,
                accessor: namespace,
                levels: actualAmount,
            });
        } else {
            savedUpgrades[index].levels = currentLevel + actualAmount;
        }

        this.update(def.target);
        return true;
    }

    constructor() {
        for (const stat in stats) {
            const data = stats[stat];
            this.stats[stat] = {
                base: data.base,
                title: data.title,
                additive: new Decimal(0),
                multiplicative: new Decimal(1),
                additiveMultiplicative: new Decimal(1),
                total: new Decimal(data.base),
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
    additive: Decimal;
    multiplicative: Decimal;
    additiveMultiplicative: Decimal;
    total: Decimal;
    title: string;
}

interface StatData {
    [key: string]: {
        base: number;
        title: string;
    }
}
