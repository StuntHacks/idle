import statsData from "./data/stats.json";
import upgradesData from "game_logic/data/upgrades.json";
import { SaveHandler } from "SaveHandler/SaveHandler";
import { Upgrade } from "types/SaveFile";
import { BigNumber } from "bignumber.js";
import _ from "lodash";
import { Currencies } from "./currencies/Currencies";

const stats = statsData as StatData;

export class StatHandler {
    private static stats: Stats = {};

    public static update(stat: string) {
        let upgrades = SaveHandler.getUpgrades();
        if (!upgrades) {
            SaveHandler.initialize();
            upgrades = SaveHandler.getUpgrades();
        }
        const filtered = upgrades.filter((u: Upgrade) => u.target === stat);
        const grouped = filtered.reduce<Record<string, Upgrade[]>>((acc: any, upgrade: Upgrade) => {
            if (!acc[upgrade.type]) {
              acc[upgrade.type] = [];
            }
            acc[upgrade.type].push(upgrade);
            return acc;
        }, {});

        let additive = BigNumber(0);
        let multiplicative = BigNumber(1);

        if (grouped.additive) {
            for (const upgrade of grouped.additive) {
                const u = _.get(upgradesData, upgrade.accessor);
                if (u) {
                    additive = additive.plus((u.find((u: Upgrade) => u.id === upgrade.id) as Upgrade).amount * upgrade.levels);
                }
            }
        }

        if (grouped.multiplicative) {
            for (const upgrade of grouped.multiplicative) {
                const u = _.get(upgradesData, upgrade.accessor);
                if (u) {
                    if (upgrade.additive) {
                        multiplicative = multiplicative.multipliedBy((u.find((u: Upgrade) => u.id === upgrade.id) as Upgrade).amount * upgrade.levels);
                    } else {
                        multiplicative = multiplicative.multipliedBy((u.find((u: Upgrade) => u.id === upgrade.id) as Upgrade).amount ** upgrade.levels);
                    }
                }
            }
        }

        this.stats[stat] = {
            ...this.stats[stat],
            additive: additive,
            multiplicative: multiplicative,
            total: BigNumber(this.stats[stat].base).plus(additive).multipliedBy(multiplicative),
        };
    }

    public static gainUpgrade(namespace: string, id: string, purchase: boolean = false, amount: number = 1): boolean {
        const upgrade = _.get(upgradesData, namespace).find((u: Upgrade) => u.id === id) as Upgrade;
        if (upgrade.type === "flag") {
            if (purchase) {
                if (!Currencies.spend(upgrade.currency, BigNumber(upgrade.cost))) {
                    return false;
                }
            }
            SaveHandler.setFlag(upgrade.target, true);
        } else {
            const save = SaveHandler.getUpgrades();
            const index = save.findIndex((u: Upgrade) => u.id === id);
            if (index > -1 && !upgrade.levels) {
                return false;
            }

            // todo: implement correct calculations for buying multiple levels at once
            const levels = save[index] ? save[index].levels : amount;

            if (index > -1 && save[index].levels >= upgrade.levels) {
                return false;
            }

            const cost = BigNumber(upgrade.levels && index > -1 ? upgrade.cost * (upgrade.costScaling ** levels) : upgrade.cost);

            if (purchase) {
                if (!Currencies.spend(upgrade.currency, cost)) {
                    return false;
                }
            }

            if (index <= -1) {
                save.push({
                    ...upgrade,
                    accessor: namespace,
                    levels: 1,
                });
            } else {
                save[index].levels += amount;
            }
            this.update(upgrade.target);
        }
        return true;
    }

    public static initialize() {
        for (let stat in stats) {
            const data = stats[stat];
            this.stats[stat] = {
                base: data.base,
                title: data.title,
                additive: BigNumber(0),
                multiplicative: BigNumber(1),
                total: BigNumber(data.base),
            };
            this.update(stat);
        }
    }

    public static get(stat: string): Stat {
        return this.stats[stat];
    }
}

export interface Stats {
    [key: string]: Stat;
}

export interface Stat {
    base: number;
    additive: BigNumber;
    multiplicative: BigNumber;
    total: BigNumber;
    title: string;
}

interface StatData {
    [key: string]: {
        base: number;
        title: string;
    }
}
