import { SaveCurrency, SavedContinuousUpgrade, SavedUpgrade, SaveFile } from "types/SaveFile";

export const defaultSave: Omit<SaveFile, "version" | "startTime" | "timestamp"> = {
    currencies: {
        normal: [] as SaveCurrency[],
        inferred: [] as SaveCurrency[],
    },
    upgrades: [] as SavedUpgrade[],
    continuousUpgrades: [] as SavedContinuousUpgrade[],
    flags: {
        tutorial: {},
        quantum: {}
    },
    stages: {
        quantum: {
            converters: [
                {
                    enabled: false,
                    locked: false,
                    acc: 0,
                },
                {
                    enabled: false,
                    locked: false,
                    acc: 0,
                },
                {
                    enabled: false,
                    locked: false,
                    acc: 0,
                },
                {
                    enabled: false,
                    locked: false,
                    acc: 0,
                },
            ]
        }
    }
}
