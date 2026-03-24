import { useSave } from "SaveHandler/SaveHandler";
import { Utils } from "utils/utils";

export class GameTimeElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const self = this;
        function update() {
            self.textContent = Utils.getTimeString(Date.now() - useSave().startTime);
            window.requestAnimationFrame(update);
        }

        window.requestAnimationFrame(update);
    }
}
