import { UI } from "ui/UI";
import { requireChild } from "utils/dom";

export class StageTabElement extends HTMLElement {
    private activeSubTab?: HTMLElement;
    private navElement: HTMLElement | null = null;
    private bgElement!: HTMLElement;
    private subTabs: HTMLElement | null = null;
    private radioStyle: boolean = false;

    constructor() {
        super();
    }

    public open() {
        this.classList.add("active");
        this.bgElement.classList.add("active");
        this.navElement?.classList.add("active");

        if (this.activeSubTab) {
            UI.switchSubTab(this.activeSubTab);
        }

        const firstSubTab = this.subTabs?.querySelector("span");
        if (this.radioStyle && firstSubTab) {
            UI.switchSubTab(firstSubTab);
        }
    }

    public close() {
        if (this.activeSubTab) UI.closeSubTab(this.activeSubTab);
        this.classList.remove("active");
        this.bgElement.classList.remove("active");
        this.navElement?.classList.remove("active");;
    }

    connectedCallback() {
        const name = this.id.split("-")[1];
        const nav = document.querySelector<HTMLElement>(`.main-nav .nav-entry[data-stage="${name}"]`);
        this.navElement = nav;

        nav?.addEventListener("click", () => {
            if (nav.classList.contains("disabled")) return;
            if (nav.classList.contains("locked")) {
                nav.classList.remove("flash");
                void nav.offsetWidth;
                nav.classList.add("flash");
                return;
            }
            if (nav.dataset.stage) UI.switchStageTab(nav.dataset.stage);
        });

        this.bgElement = requireChild(document, `.stage-background.${name}`);
        const subTabs = this.querySelector<HTMLElement>("nav.sub-tabs");
        this.subTabs = subTabs;

        if (!subTabs) return;
        this.radioStyle = subTabs.classList.contains("radio-style");

        const tabs = subTabs.getElementsByTagName("span");
        for (const tab of Array.from(tabs)) {
            tab.addEventListener("click", (e: MouseEvent) => {
                const target = (e.target as HTMLElement).closest("nav.sub-tabs span") as HTMLSpanElement;
                if (!target.classList.contains("disabled")) {
                    if (target.classList.contains("active")) {
                        if (this.radioStyle) return;
                        UI.closeSubTab(target);
                        this.activeSubTab = undefined;
                    } else {
                        UI.switchSubTab(target);
                        this.activeSubTab = target;
                    }
                }
            });
        }
    }
}
