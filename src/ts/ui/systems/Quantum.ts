import { EnergyUI } from "./quantum/Energy";

export class QuantumUI {
    public static initialize() {
        EnergyUI.initialize();
    }

    public static update(timestamp: number) {
        EnergyUI.update(timestamp);
    }
}
