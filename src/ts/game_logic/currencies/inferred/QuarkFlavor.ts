import { AggregateCurrency } from "../AggregateCurrency";

const COLORS = ["red", "green", "blue"] as const;

export class QuarkFlavor extends AggregateCurrency {
    private flavor: string;

    constructor(flavor: string) {
        super(`quarks-${flavor}`);
        this.flavor = flavor;
    }

    protected getSources(): string[] {
        return COLORS.map(color => `quarks-${this.flavor}-${color}`);
    }
}
