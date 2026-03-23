import { UI } from "ui/UI";

export const TAB_TRANSITION = 200;

export class StageTabElement extends HTMLElement {
    private activeSubTab?: HTMLElement;
    private navElement: HTMLElement;
    private bgElement: HTMLElement;
    private subTabs: HTMLElement;
    private radioStyle: boolean = false;

    constructor() {
        super();
    }

    public open() {
        this.classList.add("active");
        this.bgElement.classList.add("active");
        this.navElement?.classList.add("active");
        if (this.activeSubTab) {
            setTimeout(() => UI.switchSubTab(this.activeSubTab), this.radioStyle ? 0 : TAB_TRANSITION);
        }

        if (this.radioStyle) {
            UI.switchSubTab(this.subTabs.querySelector("span"));
        }
    }

    public close(): boolean {
        UI.closeSubTab(this.activeSubTab);
        setTimeout(() => {
            this.classList.remove("active");
            this.bgElement.classList.remove("active");
            this.navElement?.classList.remove("active");
        }, this.activeSubTab && !this.radioStyle ? TAB_TRANSITION : 0);
        return this.activeSubTab !== undefined && !this.radioStyle;
    }

    connectedCallback() {
        const name = this.id.split("-")[1];
        this.navElement = document.querySelector(`.main-nav .nav-entry[data-stage="${name}"]`);

        this.navElement?.addEventListener("click", () => {
            if (this.navElement.classList.contains("disabled")) return;
            if (this.navElement.classList.contains("locked")) {
                this.navElement.classList.remove("flash");
                void this.navElement.offsetWidth;
                this.navElement.classList.add("flash");
                return;
            }
            UI.switchStageTab(this.navElement.dataset.stage);
        });

        this.bgElement = this.parentElement.querySelector(`.stage-background.${name}`);
        this.subTabs = this.querySelector("nav.sub-tabs");

        if (!this.subTabs) return;
        this.radioStyle = this.subTabs.classList.contains("radio-style");

        const tabs = this.subTabs.getElementsByTagName("span");
        for (const tab of Array.from(tabs)) {
            tab.addEventListener("click", (e: MouseEvent) => {
                const target = (e.target as HTMLElement).closest("nav.sub-tabs span") as HTMLSpanElement;
                if (!target.classList.contains("disabled")) {
                    if (target.classList.contains("active")) {
                        if (this.subTabs.classList.contains("radio-style")) return;
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
