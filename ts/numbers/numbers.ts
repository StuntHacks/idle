import { BigNumber } from "bignumber.js"

export namespace Numbers {
    export const getFormatted = (num: BigNumber): string => {
        return num.toString().replace("+", "");
    }
    
    export const getFormattedFromString = (num: string): string => {
        return getFormatted(BigNumber(num));
    }
}
