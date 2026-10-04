import Decimal from "break_eternity.js";

export type CutoffType = { upper?: string, lower?: string };
export type Rounding = "floor" | "ceil";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Numbers {
    export const round = (value: number, precision: number, rounding: Rounding = "floor"): number => {
        const factor = Math.pow(10, precision);
        const scaled = value * factor;
        const epsilon = Math.abs(scaled) * 1e-12;
        return (rounding === "ceil" ? Math.ceil(scaled - epsilon) : Math.floor(scaled + epsilon)) / factor;
    };

    export const getFormatted = (
        num: Decimal,
        maxPrecision: number = 2,
        cutoff: CutoffType = { upper: "1e6", lower: "1e-6" },
        rounding: Rounding = "floor",
    ): string => {
        if (num.eq(0)) {
            return "0";
        }

        if (num.lt(0)) {
            return "-" + getFormatted(num.neg(), maxPrecision, cutoff, rounding);
        }

        if (num.gte(cutoff.upper ?? "1e6") || num.lte(cutoff.lower ?? "1e-6")) {
            let mantissa = round(num.m, maxPrecision, rounding);
            let exponent = num.e;
            if (mantissa >= 10) {
                mantissa /= 10;
                exponent += 1;
            }
            return `${mantissa.toFixed(maxPrecision)}e${exponent}`;
        }

        const str = round(num.toNumber(), maxPrecision, rounding).toFixed(maxPrecision);
        return str.includes(".") ? str.replace(/\.?0+$/, "") : str;
    };
}
