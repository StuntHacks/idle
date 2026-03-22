import { SaveCurrency, SaveFile, Upgrade } from "types/SaveFile";
import { Settings } from "utils/Settings";

export const defaultSave: Omit<SaveFile, "version" | "startTime" | "timestamp"> = {
    currencies: {
        normal: [] as SaveCurrency[],
        inferred: [] as SaveCurrency[],
    },
    settings: Settings.default(),
    upgrades: [] as Upgrade[],
    flags: {
        tutorial: {},
        quantum: {}
    }
}
