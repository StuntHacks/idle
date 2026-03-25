import { SAVE_FILE_VERSION } from "SaveHandler/SaveHandler";
import Decimal from "break_eternity.js";

export interface SaveFile {
    version: typeof SAVE_FILE_VERSION;
    gameVersion?: string;
    startTime: number;
    timestamp: number;
    currencies: {
        normal: SaveCurrency[];
        inferred: SaveCurrency[];
    };
    upgrades: SavedUpgrade[];
    flags: Flags,
}

type Flags = {[key: string]: boolean | Flags};

export type UpgradeType = "flag" | "additive" | "multiplicative" | "additive_multiplicative";
export interface UpgradeDef {
    id: string;
    title: string;
    effect?: string;
    target: string;
    type: UpgradeType;
    amount?: number;
    cost: number;
    costScaling?: number;
    levels?: number;
    currency: string;
}

export interface SavedUpgrade {
    id: string;
    accessor: string;
    levels: number;
}

export interface SaveCurrency {
    amount: Decimal;
    className?: string;
    hash: string;
}
