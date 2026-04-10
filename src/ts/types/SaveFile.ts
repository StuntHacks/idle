import { SAVE_FILE_VERSION } from "SaveHandler/SaveHandler";
import Decimal from "break_eternity.js";
import { QuantumStageUnlocks } from "game_logic/stages/quantum/Quantum";

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
    continuousUpgrades: SavedContinuousUpgrade[];
    flags: Flags;
    stages: {
        quantum: {
            hideCompletedUpgrades: {
                energy: boolean;
            },
            unlocks: QuantumStageUnlocks,
            converters: {
                enabled: boolean;
                locked: boolean;
                acc: number;
                committed: Decimal;
            }[];
            conversionInput: Decimal;
            fluctuators?: boolean[];
            fields: {
                selected: QuantumFieldType;
                next?: QuantumFieldType;
            }[];
        }
    }
}

export type Flags = { [key: string]: boolean | Flags };
export type QuantumFieldType = "lepton" | "quark" | "gluon" | "higgs" | "electroweak" | "neutrino";
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
    continuous?: false;
    icon?: string;
    requirements?: string[];
}

export interface ContinuousUpgradeDef {
    id: string;
    title: string;
    effect?: string;
    target: string;
    type: Exclude<UpgradeType, "flag">;
    amount?: number;
    continuous: true;
    curve: string;
    scale: number;
    icon?: string;
    requirements?: string[];
}

export type AnyUpgradeDef = UpgradeDef | ContinuousUpgradeDef;

export interface SavedUpgrade {
    id: string;
    accessor: string;
    levels: number;
}

export interface SavedContinuousUpgrade {
    id: string;
    accessor: string;
    spent: Decimal;
}

export interface SaveCurrency {
    amount: Decimal;
    className?: string;
    hash: string;
}
