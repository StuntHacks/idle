import { SaveCurrency, SavedUpgrade, SaveFile } from "types/SaveFile";

export const defaultSave: Omit<SaveFile, "version" | "startTime" | "timestamp"> = {
    currencies: {
        normal: [] as SaveCurrency[],
        inferred: [] as SaveCurrency[],
    },
    upgrades: [] as SavedUpgrade[],
    flags: {
        tutorial: {},
        quantum: {}
    }
}
