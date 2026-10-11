import constants from "game_logic/data/constants.json";
import get from "lodash/get";
import Decimal from "break_eternity.js";
import { CutoffType, Numbers } from "numbers/numbers";
import { Logger } from "utils/Logger";

export class Constants {
    public static getFormatted(path: string, maxPrecision?: number, cutoff?: CutoffType): string {
        const value: unknown = get(constants, path);
        if (typeof value === "number") return Numbers.getFormatted(new Decimal(value), maxPrecision, cutoff);
        if (typeof value === "string" || typeof value === "boolean") return String(value);
        Logger.warning("Constants", `Unknown constant ${path}`);
        return path;
    }
}
