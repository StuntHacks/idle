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
    },
    enabledFlags: {
        quantum: {
            fluctuators: {
                f0: true,
                f1: true,
                f2: true,
                f3: true,
                f4: true
            }
        }
    }
}
