import { requireElement } from "utils/dom";
import { FIELD_DATA } from "../game_logic/stages/quantum/field_data";
import { QuantumField } from "game_logic/stages/quantum/Field";

export class AboutUI {
    private static element?: QuantumField;
    public static initialize() {
        this.element = new QuantumField(FIELD_DATA.quark, -1, undefined, requireElement("title-wave"), true, true);
    }
}
