import fieldsData from "game_logic/data/fields.json";
import { FieldModel } from "./Field";

interface FieldData {
    [key: string]: FieldModel;
};

export const FIELD_DATA = fieldsData as FieldData;
