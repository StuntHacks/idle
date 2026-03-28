import Decimal from "break_eternity.js";

export type CurveFunction = (spent: Decimal, scale: number) => Decimal;
export const curves: Record<string, CurveFunction> = {
    power: (spent, scale) => new Decimal(scale).pow(spent),
    logarithmic: (spent, scale) => new Decimal(1).plus(spent.plus(1).log(10).times(scale)),
    linear: (spent, scale) => new Decimal(1).plus(spent.times(scale)),
    polynomial: (spent, scale) => new Decimal(1).plus(spent.pow(scale)),
    reverse_log: (spent, scale) => new Decimal(1).divide(new Decimal(1).plus(spent.plus(1).log(10).times(scale)))
};
