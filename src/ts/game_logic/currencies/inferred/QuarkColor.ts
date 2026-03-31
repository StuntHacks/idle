import { AggregateCurrency } from "../AggregateCurrency";

export class QuarkColor extends AggregateCurrency {
    private color: string;
    private availableFlavors: string[];

    constructor(color: string, initialFlavors: string[]) {
        super(`quarks-${color}`);
        this.color = color;
        this.availableFlavors = [...initialFlavors];
    }

    protected getSources(): string[] {
        return this.availableFlavors.map(flavor => `quarks-${flavor}-${this.color}`);
    }

    public unlockFlavor(flavor: string): void {
        if (!this.availableFlavors.includes(flavor)) {
            this.availableFlavors.push(flavor);
        }
    }

    public lockFlavor(flavor: string): void {
        this.availableFlavors = this.availableFlavors.filter(f => f !== flavor);
    }

    public getAvailableFlavors(): string[] {
        return [...this.availableFlavors];
    }
}
