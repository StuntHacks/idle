import { BigNumber } from "bignumber.js";
import statsData from "./data/stats.json";
const stats = statsData as StatData;

export class StatHandler {
    private static stats: Stats = {};

    public static update(id: string) {

    }

    public static initialize() {
        for (let stat in stats) {
            const data = stats[stat];
            this.stats[stat] = {
                base: data.base,
                title: data.title,
                additive: BigNumber(0),
                multiplicative: BigNumber(1),
                total: BigNumber(1),
            };
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
