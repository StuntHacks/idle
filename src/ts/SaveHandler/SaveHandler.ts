import { SaveFile, SavedUpgrade, SavedContinuousUpgrade } from "types/SaveFile";
import { UI } from "ui/UI";
import { Logger } from "utils/Logger";
import mock from "./mock.json"
import { Utils } from "utils/utils";
import { defaultSave } from "./defaultSave";
import { initSettings } from "utils/SettingsHandler";
import { useCurrencyHandler } from "game_logic/currencies/Currencies";
import _ from "lodash";

export const SAVE_FILE_VERSION = 6;
const SAVE_FILE_NAME = "idledynamics_saveFile";

export class SaveHandler {
    private save: SaveFile;
    private lastSave: number = 0;
    private flagCallbacks: { [key: string]: FlagCallback[] } = {};

    constructor() {
        initSettings();
        if (!this.loadData()) {
            this.reset();
        }
    }

    public loadData(): boolean {
        Logger.log("SaveHandler", "Loading save file...");
        let data = localStorage.getItem(SAVE_FILE_NAME);
        if (data === null) {
            Logger.log("SaveHandler", "No save data found!");
            this.reset();
            return true;
        }

        let parsed = JSON.parse(this.decode(data));
        if (parsed.version === undefined || parsed.version < SAVE_FILE_VERSION) {
            // todo: implement proper migration
            Logger.log("SaveHandler", "Outdated save file, resetting...");
            this.reset();
        } else {
            this.save = parsed;
        }

        return true;
    }

    public autoSave = () => {
        const now = performance.now();
        const elapsed = now - this.lastSave;
        if (elapsed >= 30000) {
            this.lastSave = now;
            this.saveData();
        }
        window.requestAnimationFrame(this.autoSave);
    }

    public saveCurrencies() {
        const [currencies, inferred] = useCurrencyHandler().getAll();

        this.save.currencies.normal = [];
        for (const c of currencies) {
            this.save.currencies.normal.push({
                hash: c.hash,
                amount: c.amount,
                className: c.className
            });
        }

        this.save.currencies.inferred = [];
        for (const c of inferred) {
            this.save.currencies.inferred.push({
                hash: c.hash,
                amount: c.handler.getAmount(),
            });
        }
    }

    public getEncoded(): string {
        return this.encode(JSON.stringify({
            ...this.save,
            timestamp: Date.now(),
            gameVersion: Utils.getVersionString(),
        } as SaveFile));
    }

    public saveData(fresh: boolean = false): void {
        if (!fresh) {
            this.saveCurrencies();
        }

        let data = this.getEncoded();
        const last = localStorage.getItem(SAVE_FILE_NAME);
        if (last) localStorage.setItem(`${SAVE_FILE_NAME}_bak`, last);
        localStorage.setItem(SAVE_FILE_NAME, data);
        UI.flashSaveIndicator();
    }

    public getData(): SaveFile {
        return this.save;
    }

    public getUpgrades(): SavedUpgrade[] {
        return this.save.upgrades;
    }

    public getContinuousUpgrades(): SavedContinuousUpgrade[] {
        return this.save.continuousUpgrades;
    }

    public registerFlagCallback(flag: string, callback: FlagCallback) {
        if (this.flagCallbacks[flag]) {
            this.flagCallbacks[flag].push(callback);
        } else {
            this.flagCallbacks[flag] = [callback];
        }
    }

    public getFlag(flag: string): boolean {
        const f = _.get(this.save.flags, flag);
        if (typeof f === "boolean") {
            return f;
        }
        return false;
    }

    public setFlag(flag: string, value: unknown) {
        const callbacks = this.flagCallbacks[flag];
        if (callbacks) {
            for (const callback of callbacks) {
                callback(flag, value);
            }
        }
        _.set(this.save.flags, flag, value);
    }

    public mutate<T>(fn: (save: SaveFile) => T): T {
        return fn(this.save);
    }

    public reset(useMock: boolean = false): SaveFile {
        Logger.log("SaveHandler", "Initializing new save file...");
        const save = useMock ? mock as unknown as SaveFile : defaultSave;
        this.save = {
            ...save,
            startTime: Date.now(),
            version: SAVE_FILE_VERSION,
            timestamp: Date.now(),
        }
        this.saveData(true);
        return this.save;
    }

    private encode(data: string): string {
        Logger.log("SaveHandler", "Encoding save data...");
        // TODO: Implement encoding logic
        return data;
    }

    private decode(data: string): string {
        Logger.log("SaveHandler", "Decoding save data...");
        // TODO: Implement decoding logic
        return data;
    }
}

export type FlagCallback = (flag: string, value: unknown) => void;

let _instance: SaveHandler;

export function useSave(): SaveFile;
export function useSave<T>(fn: (save: SaveFile) => T): T;
export function useSave<T>(fn?: (save: SaveFile) => T): SaveFile | T {
    if (!_instance) throw new Error("Call initSaveHandler() first");
    if (fn) return _instance.mutate(fn);
    return _instance.getData();
}

export function useFlag(flag: string): boolean;
export function useFlag(flag: string, value?: unknown): void;
export function useFlag(flag: string, value?: unknown): boolean | void {
    if (!_instance) throw new Error("Call initSaveHandler() first");
    if (value !== undefined) {
        _instance.setFlag(flag, value);
    } else {
        return _instance.getFlag(flag);
    }
};

export const useSaveHandler = (): SaveHandler => {
    if (!_instance) throw new Error("Call initSaveHandler() first");
    return _instance;
};

export const initSaveHandler = (): SaveHandler => {
    _instance = new SaveHandler();
    return _instance;
};
