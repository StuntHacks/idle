import { Currencies } from "game_logic/currencies/Currencies";
import { SaveFile, Upgrade } from "types/SaveFile";
import { UI } from "ui/UI";
import { Logger } from "utils/Logger";
import { Settings } from "utils/Settings";
import mock from "./mock.json"
import _ from "lodash";

export class SaveHandler {
    private static save: SaveFile;
    private static lastSave: number = 0;
    private static flagCallbacks: { [key: string]: FlagCallback[] } = {};

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

    public static autoSave(timestamp: number) {
        const now = performance.now();
        const elapsed = now - SaveHandler.lastSave;
        if (elapsed >= 30000) {
            SaveHandler.lastSave = now;
            SaveHandler.saveData();
        }
        window.requestAnimationFrame(SaveHandler.autoSave)
    }

    public static getVersion(): number {
        return 3;
    }

    public static saveCurrencies() {
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
    }

    public static saveData(fresh: boolean = false): void {
        let data = SaveHandler.encode(JSON.stringify(SaveHandler.save));

        if (!fresh) {
            SaveHandler.saveCurrencies();
        }

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

    public static registerFlagCallback(flag: string, callback: FlagCallback) {
        if (this.flagCallbacks[flag]) {
            this.flagCallbacks[flag].push(callback);
        } else {
            this.flagCallbacks[flag] = [callback];
        }
    }

    public static getFlag(flag: string) {
        return _.get(this.save.flags, flag);
    }

    public static setFlag(flag: string, value: any) {
        const callbacks = this.flagCallbacks[flag];
        if (callbacks) {
            for (const callback of callbacks) {
                callback(flag, value);
            }
        }
        _.set(this.save.flags, flag, value);
    }

    public static initialize(useMock: boolean = false): SaveFile {
        Logger.log("SaveHandler", "Initializing new save file...");
        this.save = useMock ? mock as unknown as SaveFile : {
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
        this.saveData(true);
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

export type FlagCallback = (flag: string, value: any) => void;
