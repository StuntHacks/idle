import { SaveFile } from "../types/SaveFile";
import { UI } from "../ui/UI";
import { Logger } from "../utils/Logger";
import { Settings } from "../utils/Settings";

export class SaveHandler {
    private static save: SaveFile;

    public static loadData(): boolean {
        Logger.log("SaveHandler", "Loading save file...");
        let data = localStorage.getItem("saveFile");
        if (data === null) {
            Logger.log("SaveHandler", "No save data found!");
            return false;
        }
        this.save = JSON.parse(this.decode(data))
        return true;
    }

    public static saveData(): void {
        let data = this.encode(JSON.stringify(this.save));
        localStorage.setItem("saveFile", data);
        UI.flashSaveIndicator();
    }

    public static getData(): SaveFile {
        return this.save;
    }

    public static initialize(): SaveFile {
        Logger.log("SaveHandler", "Initializing new save file...");
        this.save = {
            settings: Settings.default(),
        };
        this.saveData();
        return this.save;
    }

    private static encode(data: string): string {
        Logger.log("SaveHandler", "Encoding save data...");
        // TODO: Implement encoding logic
        return data;
    }

    private static decode(data: string): string {
        Logger.log("SaveHandler", "Decoding save data...");
        // TODO: Implement decoding logic
        return data;
    }
}
