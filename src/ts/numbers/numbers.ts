import Decimal from "break_eternity.js";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Numbers {
    export const getFormatted = (num: Decimal, precision: number = 0): string => {
        if (num.eq(0)) {
            return "0";
        }

        if (num.gte("1e6") || num.lte("1e-6")) {
            // Use .m (mantissa) and .e (exponent) directly — no string parsing needed
            const mantissa = Math.floor(num.m * 100) / 100;
            return `${mantissa.toFixed(2)}e${num.e}`;
        }

        // Replicate ROUND_FLOOR manually using Math.floor
        const factor = Math.pow(10, precision);
        const floored = Math.floor(num.toNumber() * factor) / factor;
        return floored.toFixed(precision);
    };

    export const getFormattedFromString = (num: string): string => {
        return getFormatted(new Decimal(num));
    };
}
