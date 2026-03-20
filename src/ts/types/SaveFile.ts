import { SAVE_FILE_VERSION } from "SaveHandler/SaveHandler";
import { Settings } from "./Settings";
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
    settings: Settings;
    upgrades: Upgrade[];
    flags: Flags,
    enabledFlags: Flags;
}

type Flags = {[key: string]: boolean | Flags};

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
    amount: Decimal;
    className?: string;
    hash: string;
}
