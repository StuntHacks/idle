import { OfflineProgressUI } from "./OfflineProgress";
import { QuantumUI } from "./systems/Quantum";

export class UI {
    public static saveIndicator: HTMLElement;
    public static mouseDown: boolean = false;
    public static mouseX: number = 0;
    public static mouseY: number = 0;
    public static initialize() {
        this.saveIndicator = document.getElementById("save-notif");
        window.requestAnimationFrame(UI.animate);

        window.addEventListener("mousedown", UI.updateMouseState);
        window.addEventListener("mousemove", UI.updateMouseState);
        window.addEventListener("mouseup", UI.updateMouseState);

        const sidescrollers = document.getElementsByClassName("js-sidescroll");
        for (let i = 0; i < sidescrollers.length; i++) {
            const element = sidescrollers[i];
            element.addEventListener('wheel', (event: WheelEvent) => {
                if (event.deltaY !== 0) {
                    event.preventDefault();
                    element.scrollLeft += event.deltaY / 2;
                }
            }, { passive: false });
        }

        OfflineProgressUI.initialize();
        QuantumUI.initialize();
        this.initializeSystemTabs();
    }

    private static initializeSystemTabs() {
        const navTabs = document.querySelectorAll(`.main-nav .nav-entry`);
        navTabs.forEach((tab: HTMLElement) => {
            tab.addEventListener("click", (e) => {
                const tab = (e.target as HTMLElement).closest(".nav-entry") as HTMLElement;
                if (tab.classList.contains("disabled")) return;
                if (tab.classList.contains("locked")) {
                    tab.classList.remove("flash");
                    void tab.offsetWidth;
                    tab.classList.add("flash");
                    return;
                }
                UI.switchSystemTab(tab.dataset.system);
            });
        });
    }

    public static switchSystemTab(tabName: string) {
        const tabs = document.querySelectorAll("system-tab");
        tabs.forEach(tab => {
            if (tab.id === `tab-${tabName}`) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });

        const navTabs = document.querySelectorAll(`.main-nav .nav-entry`);
        navTabs.forEach((tab: HTMLElement) => {
            if (tab.dataset.system === tabName) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });

        const backgrounds = document.querySelectorAll(`.system-background`);
        backgrounds.forEach((background: HTMLElement) => {
            if (background.classList.contains(tabName)) {
                background.classList.add("active");
            } else {
                background.classList.remove("active");
            }
        });
    }

    private static updateMouseState(e: MouseEvent) {
        let flags = e.buttons !== undefined ? e.buttons : e.which;
        UI.mouseDown = (flags & 1) === 1;
        UI.mouseX = e.clientX;
        UI.mouseY = e.clientY;
    }

    public static animate(timestamp: number) {
        QuantumUI.update(timestamp);

        window.requestAnimationFrame(UI.animate);
    }

    public static flashSaveIndicator() {
        if (this.saveIndicator) {
            this.saveIndicator.classList.add("shown");

            window.requestAnimationFrame(() => {
                this.saveIndicator.classList.remove("shown");
            });
        }
    }
}
