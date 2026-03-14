import { EnergyUI } from "./quantum/Energy";
import { FieldsTab } from "./quantum/FieldsTab";

export class QuantumUI {
    public static initialize() {
        EnergyUI.initialize();
        FieldsTab.initialize();
    }

    public static update(timestamp: number) {
        EnergyUI.update(timestamp);
    }
}
