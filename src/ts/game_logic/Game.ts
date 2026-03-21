import { SaveHandler } from "SaveHandler/SaveHandler";
import { StatHandler } from "./StatHandler";
import { QuantumSystem } from "./systems/quantum/Quantum";
import { OfflineProgressUI } from "ui/OfflineProgress";
import { Utils } from "utils/utils";
import { Logger } from "utils/Logger";
import { Settings } from "utils/Settings";

export interface OfflineResults { [key: string]: unknown }; // placeholder

export abstract class System {
    public abstract update(tickLength: number, catchingUp: boolean): void;
    public abstract identifier: string;
}

const TICK_RATE = 20;
const TICK_LENGTH = 1000 / TICK_RATE;

export class Game {
    private lastTimestamp: number = undefined;
    private delta: number = 0;
    private systems: System[];
    private catchingUp: boolean = false;

    constructor() {
        if (!SaveHandler.loadData()) {
            SaveHandler.initialize();
        }

        StatHandler.initialize();

        this.systems = [new QuantumSystem()];

        window.addEventListener("beforeunload", () => {
            SaveHandler.saveData();
        });
    }

    public testingTimeskip() {
        this.lastTimestamp -= 60000;
    }

    public async start() {
        SaveHandler.autoSave();
        const now = Date.now();
        let savedTimestamp = SaveHandler.getData().timestamp ?? now;
        if (Settings.get().gameplay.settings.noOfflineTime?.value) {
            savedTimestamp = now;
        }
        const offlineGap = now - savedTimestamp;

        if (offlineGap > 5000) {
            await this.calculateOfflineProgress(offlineGap);
        } else {
            OfflineProgressUI.dismiss();
        }

        window.requestAnimationFrame(this.loop);
    }

    private loop = (timestamp: number) => {
        window.requestAnimationFrame(this.loop);

        if (this.lastTimestamp === undefined) {
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
        this.catchingUp = this.delta > TICK_LENGTH * 2;

        while (this.delta >= TICK_LENGTH) {
            if (this.catchingUp) break;
            this.tick(TICK_LENGTH);
            this.delta -= TICK_LENGTH;
        }

        this.catchingUp = false;
    }

    private tick(tickLength: number) {
        for (const system of this.systems) {
            system.update(tickLength, this.catchingUp);
        }
    }

    private calculateOfflineProgress(time: number, catchUp: boolean = false): Promise<void> {
        Logger.log("Game", `Calculating progress for ${Utils.getTimeString(time)} of offline time...`);
        const totalTicks = Math.floor(time / TICK_LENGTH);
        let ticksDone = 0;
        this.catchingUp = true;

        if (!catchUp) {
            OfflineProgressUI.initUI();
            OfflineProgressUI.setDuration(Utils.getTimeString(time));
        }

        return new Promise(resolve => {
            const processChunk = () => {
                const chunkStart = performance.now();

                while (ticksDone < totalTicks) {
                    this.tick(TICK_LENGTH);
                    ticksDone++;
                    if (performance.now() - chunkStart >= 50) break; // yield
                }

                //OfflineProgressUI.setProgress(ticksDone / totalTicks);

                if (ticksDone < totalTicks) {
                    setTimeout(processChunk, 0);
                } else {
                    this.catchingUp = false;
                    if (!catchUp) {
                        if (time > 60 * 1000) {
                            OfflineProgressUI.renderProgress({ foo: 0 });
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
