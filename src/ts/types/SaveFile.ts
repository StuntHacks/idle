import { Settings } from "./Settings";

export interface SaveFile {
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
}
