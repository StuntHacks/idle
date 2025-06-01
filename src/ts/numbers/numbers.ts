import { BigNumber } from "bignumber.js"

export namespace Numbers {
    export const getFormatted = (num: BigNumber, precision: number = 0): string => {
        BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

        if (num.eq("0")) {
            return "0";
        }
        if (num.gte("1e6") || num.lte("1e-6")) {
            const [mantissa, exponent] = num.toPrecision(precision).replace("+", "").split("e");
            return `${new BigNumber(mantissa).toPrecision(precision)}e${exponent}`;
        } else {
            if (num.isInteger()) {
                return num.toFixed(0);
            } else {
                return num.toFixed(precision);
            }
        }
    }
    
    export const getFormattedFromString = (num: string): string => {
        return getFormatted(BigNumber(num));
    }
}
