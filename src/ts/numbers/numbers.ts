import { BigNumber } from "bignumber.js"

export namespace Numbers {
    export const getFormatted = (num: BigNumber): string => {
        if (num.toString().includes("e")) {
            let ret;

            let parts = num.toString().replace("+", "").split("e");
            parts[0] = parts[0].slice(0, 4);

            return parts.join("e");
        } else {
            return num.toString();
        }
    }
    
    export const getFormattedFromString = (num: string): string => {
        return getFormatted(BigNumber(num));
    }
}
