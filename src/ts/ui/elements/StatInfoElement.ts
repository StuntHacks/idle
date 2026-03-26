import Decimal from "break_eternity.js";
import { Energy } from "game_logic/currencies/inferred/Energy";
import { useStat } from "game_logic/StatHandler";

export class StatInfoElement extends HTMLElement {
    private stat: string;
    private content: string;

    constructor() {
        super();
    }

    private refresh = () => {
        switch (this.stat) {
            case "energy_gain":
                // todo: handle this via StatHandler callback
                const newContent = Energy.getFormatted(new Decimal(useStat("energy_gain").total), 3);
                if (this.content !== newContent) {
                    this.content = newContent;
                    this.textContent = newContent;
                }

                window.requestAnimationFrame(this.refresh);
                break;
            default:
                // todo: generic stat logic
                break;
        }
    }

    connectedCallback() {
        this.stat = this.getAttribute("name");
        this.refresh();
    }
}
