import { EnergyUI } from "./quantum/Energy";
import { FieldsTabUI } from "./quantum/FieldsTab";

export class QuantumUI {
    public static initialize() {
        EnergyUI.initialize();
        FieldsTabUI.initialize();
    }

    public static update(timestamp: number) {
        EnergyUI.update(timestamp);
    }
}
