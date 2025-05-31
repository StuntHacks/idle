import { Currencies } from "game_logic/currencies/Currencies";
import { SaveFile, Upgrade } from "types/SaveFile";
import { UI } from "ui/UI";
import { Logger } from "utils/Logger";
import { Settings } from "utils/Settings";
import _ from "lodash";

export class SaveHandler {
    private static save: SaveFile;

    public static loadData(): boolean {
        Logger.log("SaveHandler", "Loading save file...");
        let data = localStorage.getItem("saveFile");
        if (data === null) {
            Logger.log("SaveHandler", "No save data found!");
            return false;
        }

        let parsed = JSON.parse(this.decode(data));
        if (parsed.version === undefined || parsed.version < this.getVersion()) {
            Logger.log("SaveHandler", "Outdated save file, resetting...");
            this.initialize();
        } else {
            this.save = parsed;
        }

        return true;
    }

    public static getVersion(): number {
        return 2;
    }

    public static saveData(): void {
        const [currencies, inferred] = Currencies.getAll();

        SaveHandler.save.currencies.normal = [];
        for (const c of currencies) {
            SaveHandler.save.currencies.normal.push({
                hash: c.hash,
                amount: c.amount,
                className: c.className
            });
        }

        SaveHandler.save.currencies.inferred = [];
        for (const c of inferred) {
            SaveHandler.save.currencies.inferred.push({
                hash: c.hash,
                amount: c.handler.getAmount(),
            });
        }

        let data = SaveHandler.encode(JSON.stringify(SaveHandler.save));

        localStorage.setItem("saveFileBak", localStorage.getItem("saveFile"));
        localStorage.setItem("saveFile", data);
        UI.flashSaveIndicator();
    }

    public static getData(): SaveFile {
        return this.save;
    }

    public static getUpgrades(): Upgrade[] {
        return this.save.upgrades;
    }

    public static getFlag(flag: "string") {
        return _.get(this.save.flags, flag);
    }

    public static setFlag(flag: string, value: any) {
        _.set(this.save.flags, flag, value);
    }

    public static initialize(): SaveFile {
        Logger.log("SaveHandler", "Initializing new save file...");
        this.save = {
            version: this.getVersion(),
            currencies: {
                normal: [],
                inferred: [],
            },
            settings: Settings.default(),
            upgrades: [],
            flags: {
                tutorial: {},
                quantum: {}
            }
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
