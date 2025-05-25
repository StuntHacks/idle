import { Currencies } from "../../game_logic/Currencies"
import { Numbers } from "../../numbers/numbers";
import { BigNumber } from "bignumber.js"

export class SystemTabElement extends HTMLElement {
    private active: string;
    private subTabs: HTMLDivElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.subTabs = this.querySelector("nav.sub-tabs");

        let tabs = this.subTabs.getElementsByTagName("span");
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", (e: MouseEvent) => {
                let target = (e.target as HTMLElement).closest("nav.sub-tabs span") as HTMLSpanElement;
                let tab = this.querySelector(`section.tab[data-tab="${target.dataset.tab}"]`)
                if (target.classList.contains("active")) {
                    target.classList.remove("active");
                    tab.classList.remove("active");
                } else {
                    target.classList.add("active");
                    tab.classList.add("active");
                }
            });
        }
    }
}
