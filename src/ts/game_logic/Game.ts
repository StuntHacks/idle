import { SaveHandler } from "SaveHandler/SaveHandler";
import { StatHandler } from "./StatHandler";
import { QuantumSystem } from "./systems/quantum/Quantum";
import { Settings } from "utils/Settings";
import { OfflineProgressUI } from "ui/OfflineProgress";
import { Logger } from "utils/Logger";
import { Utils } from "utils/utils";

export interface OfflineResults { [key: string]: unknown }; // placeholder

const TICK_RATE = 20;

export abstract class System {
    public abstract update(timestamp: number): void;
    public abstract identifier: string;
}

export class Game {
    private lastTimestamp: number = undefined;
    private delta: number = 0;
    private systems: System[];

    constructor() {
        if (!SaveHandler.loadData()) {
            SaveHandler.initialize();
        }

        StatHandler.initialize();

        this.systems = [
            new QuantumSystem()
        ];

        window.requestAnimationFrame(SaveHandler.autoSave);
        window.addEventListener("beforeunload", () => {
            // handle closing
            SaveHandler.saveData();
        });
    }

    public start() {
        this.lastTimestamp = SaveHandler.getData().timestamp ?? Date.now();
        //this.calculateOfflineProgress(this.lastTimestamp);
        this.lastTimestamp = Date.now(); // remove
        const tickLength = 1000 / TICK_RATE;

        const loop = (timestamp: number) => {
            if (!this.lastTimestamp) {
                this.lastTimestamp = timestamp;
                return;
            }

            const elapsed = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            this.delta += elapsed;

            while (this.delta >= tickLength) {
                this.tick(tickLength);
                this.delta -= tickLength;
            }

            window.requestAnimationFrame(loop);
        }

        window.requestAnimationFrame(loop);
    }

    private tick = (tickLength: number) => {
        for (const system of this.systems) {
            system.update(tickLength)
        }
    }

    public calculateOfflineProgress(timestamp: number) {
        const calculate = (time: number, now: number) => {
            Logger.log("Game", `Calculating progress for ${Utils.getTimeString(time)} of offline time...`);
            if (!time) return { ticksSimulated: 0, timeMs: 0 };

            const tickLength = 1000 / TICK_RATE;
            const ticksToRun = Math.floor(time / tickLength);

            for (let i = 0; i < ticksToRun; i++) {
                for (const system of this.systems) {
                    system.update(tickLength);
                }
            }

            this.lastTimestamp = now;
            return { ticks: ticksToRun, time: time };
        }

        if (!Settings.get().gameplay.settings.noOfflineTime.value) {
            const now = Date.now();
            const time = now - timestamp;

            OfflineProgressUI.initUI();
            OfflineProgressUI.setDuration(Utils.getTimeString(time));

            calculate(time, now);

            if (time > 60 * 1000) {
                OfflineProgressUI.renderProgress({ foo: 0 });
            } else {
                OfflineProgressUI.dismiss();
            }
        } else {
            OfflineProgressUI.dismiss();
        }
    }
}
