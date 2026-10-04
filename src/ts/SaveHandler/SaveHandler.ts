import { SaveFile, SavedUpgrade, SavedContinuousUpgrade } from "types/SaveFile";
import { UI } from "ui/UI";
import { Logger } from "utils/Logger";
import mock from "./mock.json"
import { Utils } from "utils/utils";
import { getDefaultSave } from "./defaultSave";
import { useCurrencyHandler } from "game_logic/currencies/Currencies";
import get from "lodash/get";
import set from "lodash/set";
import mergeWith from "lodash/mergeWith";
import Decimal, { DecimalSource } from "break_eternity.js";

export const SAVE_FILE_VERSION = 7;
export const SAVE_FILE_NAME = "idledynamics_saveFile";

export class SaveHandler {
    private save!: SaveFile;
    private flagCallbacks: { [key: string]: FlagCallback[] } = {};

    constructor() {
        this.loadData();
    }

    private mergeSaves(loaded: Partial<SaveFile>): SaveFile {
        const merged: SaveFile = mergeWith(
            {},
            getDefaultSave(),
            { version: SAVE_FILE_VERSION, startTime: Date.now(), timestamp: Date.now() },
            loaded,
            (objVal: unknown, srcVal: unknown) => {
                if (srcVal instanceof Decimal) return srcVal;
                if (Array.isArray(srcVal)) return srcVal;
                return undefined;
            }
        );
        SaveHandler.parseDecimals(merged);
        return merged;
    }

    private static parseDecimals(save: SaveFile) {
        const toDecimal = (value: DecimalSource) => new Decimal(value ?? 0);

        for (const c of save.currencies.normal) c.amount = toDecimal(c.amount);
        for (const c of save.currencies.inferred) c.amount = toDecimal(c.amount);
        for (const u of save.continuousUpgrades) u.spent = toDecimal(u.spent);

        const quantum = save.stages.quantum;
        quantum.conversionInput = toDecimal(quantum.conversionInput ?? 1);
        for (const converter of quantum.converters) converter.committed = toDecimal(converter.committed);
    }

    public loadData() {
        Logger.log("SaveHandler", "Loading save file...");
        const data = localStorage.getItem(SAVE_FILE_NAME);
        if (data === null) {
            Logger.log("SaveHandler", "No save data found!");
            this.reset();
            return;
        }

        const parsed = JSON.parse(this.decode(data));
        if (parsed.version === undefined || parsed.version < SAVE_FILE_VERSION) {
            Logger.log("SaveHandler", "Outdated save file, resetting...");
            this.reset();
        } else {
            this.save = this.mergeSaves(parsed);
        }
    }

    public importData(encoded: string): ImportResult {
        Logger.log("SaveHandler", "Importing save file...");
        let parsed: Partial<SaveFile>;
        try {
            parsed = JSON.parse(this.decode(encoded.trim()));
        } catch (e) {
            Logger.warning("SaveHandler", "Error parsing save data", e);
            return "invalid";
        }

        if (typeof parsed?.version !== "number") {
            Logger.warning("SaveHandler", "Invalid save version");
            return "invalid";
        }

        if (parsed.version < SAVE_FILE_VERSION) {
            Logger.warning("SaveHandler", `Outdated save file (${parsed.version} < ${SAVE_FILE_VERSION})`);
            return "outdated";
        }

        this.save = this.mergeSaves(parsed);
        this.saveData(true);
        return "ok";
    }

    public exportData(): string {
        this.saveCurrencies();
        return this.getEncoded();
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
            if (!c.handler.isPersisted) continue;
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
        const f = get(this.save.flags, flag);
        if (typeof f === "boolean") {
            return f;
        }
        return false;
    }

    public setFlag(flag: string, value: unknown) {
        set(this.save.flags, flag, value);
        const callbacks = this.flagCallbacks[flag];
        if (callbacks) {
            for (const callback of callbacks) {
                callback(flag, value);
            }
        }
    }

    public mutate<T>(fn: (save: SaveFile) => T): T {
        return fn(this.save);
    }

    public reset(useMock: boolean = false): SaveFile {
        Logger.log("SaveHandler", "Initializing new save file...");
        const save = useMock ? structuredClone(mock) as unknown as SaveFile : getDefaultSave();
        this.save = {
            ...save,
            startTime: Date.now(),
            version: SAVE_FILE_VERSION,
            timestamp: Date.now(),
        }
        SaveHandler.parseDecimals(this.save);
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
export type ImportResult = "ok" | "invalid" | "outdated";

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
