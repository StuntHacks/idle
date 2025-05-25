import { Currencies } from "../../game_logic/Currencies"
import { Numbers } from "../../numbers/numbers";
import { BigNumber } from "bignumber.js"

export class SystemTabElement extends HTMLElement {
    private active: string;

    constructor() {
        super();
    }

    connectedCallback() {
        let subTabs = this.querySelector("nav.sub-tabs");
        let background = this.querySelector(".tab-background");

        let tabs = subTabs.getElementsByTagName("span");
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", (e: MouseEvent) => {
                let target = (e.target as HTMLElement).closest("nav.sub-tabs span") as HTMLSpanElement;
                let tab = this.querySelector(`section.tab[data-tab="${target.dataset.tab}"]`);
                if (target.classList.contains("active")) {
                    target.classList.remove("active");
                    tab.classList.remove("active");
                    background.classList.remove("active");
                } else {
                    let tabs = this.querySelectorAll("section.tab");
                    let tabHeaders = target.closest(".sub-tabs").querySelectorAll("span");

                    tabs.forEach(e => e.classList.remove("active"));
                    tabHeaders.forEach(e => e.classList.remove("active"));

                    target.classList.add("active");
                    tab.classList.add("active");
                    background.classList.add("active");
                    target.classList.remove("new");
                }
            });
        }
    }
}
