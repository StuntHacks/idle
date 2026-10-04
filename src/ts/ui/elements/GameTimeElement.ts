import { useSave } from "SaveHandler/SaveHandler";
import { Utils } from "utils/utils";

export class GameTimeElement extends HTMLElement {
    private lastSecond: number = -1;

    constructor() {
        super();
    }

    connectedCallback() {
        const update = () => {
            const elapsed = Date.now() - useSave().startTime;
            const second = Math.floor(elapsed / 1000);
            if (second !== this.lastSecond) {
                this.lastSecond = second;
                this.textContent = Utils.getTimeString(elapsed);
            }
            window.requestAnimationFrame(update);
        };

        window.requestAnimationFrame(update);
    }
}
