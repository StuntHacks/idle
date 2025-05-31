import { BigNumber } from "bignumber.js"

export namespace Numbers {
    export const getFormatted = (num: BigNumber, precision: number = 0): string => {
        const fixed = num.toFixed(precision);
        if (fixed.includes("e")) {
            let ret;

            let parts = fixed.replace("+", "").split("e");
            parts[0] = parts[0].slice(0, 4);

            return parts.join("e");
        } else {
            return fixed;
        }
    }
    
    export const getFormattedFromString = (num: string): string => {
        return getFormatted(BigNumber(num));
    }
}
