import { useStat } from "game_logic/StatHandler";
import { EnergyUI } from "./quantum/Energy";
import { FieldsTabUI } from "./quantum/FieldsTab";
import { useTranslation } from "i18n/i18n";
import { requireElement } from "utils/dom";

export class QuantumUI {
    public static initialize() {
        EnergyUI.initialize();
        FieldsTabUI.initialize();
    }

    public static updateActiveConverters(num: number) {
        const container = requireElement("active-converters");
        container.textContent = `${useTranslation("stages.quantum.energy.conversion.active")} ${num}/${useStat("max_converters").total.toNumber()}`;
    }
}
