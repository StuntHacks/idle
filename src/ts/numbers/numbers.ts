import Decimal from "break_eternity.js";

type CutoffType = { upper?: string, lower?: string };
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Numbers {
    export const getFormatted = (num: Decimal, maxPrecision: number = 2, cutoff: CutoffType = { upper: "1e6", lower: "1e-6" }): string => {
        if (num.eq(0)) {
            return "0";
        }

        if (num.gte(cutoff.upper ?? "1e6") || num.lte(cutoff.lower ?? "1e-6")) {
            const factor = Math.pow(10, maxPrecision);
            const mantissa = Math.floor(num.m * factor) / factor;
            return `${mantissa.toFixed(maxPrecision)}e${num.e}`;
        }

        const factor = Math.pow(10, maxPrecision);
        const floored = new Decimal(Math.floor(num.toNumber() * factor) / factor);
        const str = floored.toFixed(maxPrecision);
        const decimals = str.split(".")[1]?.replace(/0+$/, "").length ?? 0;

        return floored.toFixed(decimals);
    };

    export const getFormattedFromString = (num: string): string => {
        return getFormatted(new Decimal(num));
    };
}
