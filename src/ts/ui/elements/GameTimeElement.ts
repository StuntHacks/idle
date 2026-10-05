import { useSave } from "SaveHandler/SaveHandler";
import { Utils } from "utils/utils";
import { RenderLoop } from "ui/RenderLoop";

export class GameTimeElement extends HTMLElement {
    private lastSecond: number = -1;

    constructor() {
        super();
    }

    private update = () => {
        const elapsed = Date.now() - useSave().startTime;
        const second = Math.floor(elapsed / 1000);
        if (second !== this.lastSecond) {
            this.lastSecond = second;
            this.textContent = Utils.getTimeString(elapsed);
        }
    }

    connectedCallback() {
        RenderLoop.subscribe(this.update);
    }

    disconnectedCallback() {
        RenderLoop.unsubscribe(this.update);
    }
}
