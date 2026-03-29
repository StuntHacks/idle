import Decimal from "break_eternity.js";
import { Energy } from "game_logic/currencies/inferred/Energy";
import { useStat } from "game_logic/StatHandler";
import { Numbers } from "numbers/numbers";

export class StatInfoElement extends HTMLElement {
    private stat: string;
    private content: string;

    constructor() {
        super();
    }

    private refresh = () => {
        // todo: handle this via StatHandler callback
        const value = new Decimal(useStat(this.stat).total);
        const total = this.hasAttribute("floored") ? value.floor() : value;
        let content;
        switch (this.stat) {
            case "energy_gain":
                content = Energy.getFormatted(total, 3);
                break;
            default:
                content = Numbers.getFormatted(total, 2);
                break;
        }

        if (this.content !== content) {
            this.content = content;
            this.textContent = content;
        }

        window.requestAnimationFrame(this.refresh);
    }

    connectedCallback() {
        this.stat = this.getAttribute("name");
        this.refresh();
    }
}
