import Decimal from "break_eternity.js";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Numbers {
    export const getFormatted = (num: Decimal, maxPrecision: number = 0): string => {
        if (num.eq(0)) {
            return "0";
        }
        
        if (num.gte("1e6") || num.lte("1e-6")) {
            const mantissa = Math.floor(num.m * 100) / 100;
            return `${mantissa.toFixed(2)}e${num.e}`;
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
