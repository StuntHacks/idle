import { QuantumStage } from "./stages/quantum/Quantum";
import { OfflineProgressUI } from "ui/OfflineProgress";
import { Utils } from "utils/utils";
import { Logger } from "utils/Logger";
import { initTranslator } from "i18n/i18n";
import { UI } from "ui/UI";
import { useSettings } from "utils/SettingsHandler";
import { initSaveHandler, useSave, useSaveHandler } from "SaveHandler/SaveHandler";
import { initStatHandler } from "./StatHandler";
import { initCurrencyHandler, useCurrencyHandler } from "./currencies/Currencies";
import Decimal from "break_eternity.js";
import { RenderClock } from "ui/RenderClock";

export interface Stage {
    update(tickLength: number, catchingUp: boolean): void;
    identifier: string;
}

const TICK_RATE = 20;
export const TICK_LENGTH = 1000 / TICK_RATE;

class Game {
    private lastTimestamp: number = undefined;
    private delta: number = 0;
    private stages: Stage[];
    private catchingUp: boolean = false;

    constructor() {
        initSaveHandler();
        initCurrencyHandler();
        initStatHandler();
        initTranslator();
        UI.initialize();

        this.stages = [new QuantumStage()];

        // todo: implement better close-handling (this can overwrite offline time with a fresh save on mobile)
        // window.addEventListener("beforeunload", () => {
        //     SaveHandler.saveData();
        // });
    }

    public timeskip(seconds: number) {
        this.lastTimestamp -= seconds * 1000;
    }

    public async start() {
        useSaveHandler().autoSave();
        const now = Date.now();
        let savedTimestamp = useSave().timestamp ?? now;
        if (useSettings().gameplay.settings.noOfflineTime?.value) {
            savedTimestamp = now;
        }
        const offlineGap = now - savedTimestamp;

        if (offlineGap > 5000) {
            await this.calculateOfflineProgress(useSettings().gameplay.settings.noOfflineTime?.value ? 0 : offlineGap);
        } else {
            OfflineProgressUI.dismiss();
        }

        window.requestAnimationFrame(this.loop);
    }

    private loop = (timestamp: number) => {
        window.requestAnimationFrame(this.loop);

        if (this.lastTimestamp === undefined) {
            this.lastTimestamp = timestamp;
            this.delta = 0;
            return;
        }

        if (this.catchingUp) {
            this.lastTimestamp = timestamp;
            return;
        }

        const elapsed = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        if (elapsed > 5000) {
            this.delta = 0;
            this.calculateOfflineProgress(elapsed, true).then(() => {
                this.lastTimestamp = undefined;
            });
            return;
        }

        this.delta += elapsed;
        if (this.delta > TICK_LENGTH * 10) {
            Logger.debug("Game", `High delta: ${this.delta.toFixed(1)}ms (${(this.delta / TICK_LENGTH).toFixed(1)} ticks)`);
        }

        while (this.delta >= TICK_LENGTH) {
            this.tick(TICK_LENGTH);
            this.delta -= TICK_LENGTH;
        }

        RenderClock.alpha = this.delta / TICK_LENGTH;
    }

    private tick(tickLength: number) {
        for (const stage of this.stages) {
            stage.update(tickLength, this.catchingUp);
        }
    }

    private calculateOfflineProgress(time: number, catchUp: boolean = false): Promise<void> {
        Logger.log("Game", `Calculating progress for ${Utils.getTimeString(time)} of offline time...`);
        const totalTicks = Math.floor(time / TICK_LENGTH);
        let ticksDone = 0;
        this.catchingUp = true;

        if (!catchUp) {
            OfflineProgressUI.prepare();
            OfflineProgressUI.setDuration(Utils.getTimeString(time));
        }

        const snapshot = useCurrencyHandler().snapshot();

        return new Promise(resolve => {
            const processChunk = () => {
                const chunkStart = performance.now();

                while (ticksDone < totalTicks) {
                    this.tick(TICK_LENGTH);
                    ticksDone++;
                    if (performance.now() - chunkStart >= 16) break;
                }

                if (ticksDone < totalTicks) {
                    setTimeout(processChunk, 0);
                } else {
                    this.catchingUp = false;
                    const results: OfflineResults = useCurrencyHandler().diff(snapshot);

                    if (!catchUp) {
                        if (time > 60 * 1000) {
                            OfflineProgressUI.renderProgress(results);
                        } else {
                            OfflineProgressUI.dismiss();
                        }
                    }

                    resolve();
                }
            };

            processChunk();
        });
    }
}

export type OfflineResults = {
    [stage: string]: {
        [group: string]: OfflineGain[];
    };
};
 
export interface OfflineGain {
    hash: string;
    amount: Decimal;
}

let _instance: Game;
export const useGame = (): Game => {
    if (!_instance) throw new Error("Call initGame() first");
    return _instance;
};
export const initGame = (): Game => {
    _instance = new Game();
    return _instance;
};
