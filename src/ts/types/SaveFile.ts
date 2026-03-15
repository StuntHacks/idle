import { SAVE_FILE_VERSION } from "SaveHandler/SaveHandler";
import { Settings } from "./Settings";

export interface SaveFile {
    version: typeof SAVE_FILE_VERSION;
    startTime: number;
    timestamp: number;
    currencies: {
        normal: SaveCurrency[];
        inferred: SaveCurrency[];
    };
    settings: Settings;
    upgrades: Upgrade[];
    flags: {
        tutorial: {
            [key: string]: boolean;
        };
        quantum: {
            [key: string]: boolean;
        };
    }
}

export interface Upgrade {
    id: string;
    title: string;
    effect?: string;
    target: string;
    type: "flag" | "additive" | "multiplicative";
    additive?: boolean;
    amount?: number;
    cost: number;
    costScaling?: number;
    levels?: number;
    currency: string;
    accessor: string;
}

export interface SaveCurrency {
    amount: BigNumber;
    className?: string;
    hash: string;
}
