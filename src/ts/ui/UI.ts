import { useSave, useSaveHandler } from "SaveHandler/SaveHandler";
import { OfflineProgressUI } from "./OfflineProgress";
import { QuantumUI } from "./stages/Quantum";
import { Utils } from "utils/utils";
import { TranslatedElement } from "./elements/TranslatedElement";
import { StageTabElement } from "./elements/StageTabElement";
import { SettingsUI } from "./Settings";
import { useSettings } from "utils/SettingsHandler";
import Decimal from "break_eternity.js";
import { Currency, useCurrency } from "game_logic/currencies/Currencies";
import { Logger } from "utils/Logger";
import { Numbers } from "numbers/numbers";
import { initPopoverManager, usePopover } from "./PopoverManager";
import { initNotifications } from "./NotificationManager";
import { ImportPopover } from "./popovers/ImportPopover";

export class UI {
    private static saveIndicator: HTMLElement;
    public static mouseDown: boolean = false;
    public static mouseX: number = 0;
    public static mouseY: number = 0;
    private static lastStageTab: string = "quantum";
    private static currencyContainerMap = new Map<string, HTMLElement>();

    public static initialize() {
        customElements.define("translated-string", TranslatedElement);
        this.saveIndicator = document.getElementById("save-notif");
        window.requestAnimationFrame(UI.animate);

        window.addEventListener("mousedown", UI.updateMouseState);
        window.addEventListener("mousemove", UI.updateMouseState);
        window.addEventListener("mouseup", UI.updateMouseState);

        window.addEventListener("touchstart", UI.updateTouchState, { passive: true });
        window.addEventListener("touchmove", UI.updateTouchState, { passive: true });
        window.addEventListener("touchend", UI.updateTouchState, { passive: true });

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

        document.querySelector("#tab-version .stage-main-content").addEventListener("scroll", (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.scrollTop > 0) {
                target.querySelector(".headlines").classList.add("shadow");
            } else {
                target.querySelector(".headlines").classList.remove("shadow");
            }
        });

        OfflineProgressUI.initialize();
        QuantumUI.initialize();
        SettingsUI.initialize();
        initPopoverManager();
        initNotifications();
        this.initializeBottomBar();
        this.updateDarkMode();
    }

    private static handleMenuTabs(tab: string): boolean {
        if (UI.getActiveStage() === tab && UI.lastStageTab !== "") {
            UI.switchStageTab(UI.lastStageTab);
            return false;
        } else {
            UI.lastStageTab = UI.getActiveStage();
            if (["settings", "about", "version"].includes(UI.lastStageTab)) {
                UI.lastStageTab = "quantum";
            }
            UI.switchStageTab(tab);
            return true;
        }
    }

    private static initializeBottomBar() {
        document.getElementById("save-button").addEventListener("click", () => {
            useSaveHandler().saveData();
        });

        document.getElementById("load-button").addEventListener("click", () => {
            usePopover(new ImportPopover());
        });

        document.getElementById("settings-button").addEventListener("click", () => {
            UI.handleMenuTabs("settings");
        });

        document.getElementById("about-button").addEventListener("click", () => {
            if (UI.handleMenuTabs("about")) {
                document.getElementById("tab-about").classList.add("slide-in");
            }
        });

        document.getElementById("version-number").addEventListener("click", () => {
            UI.handleMenuTabs("version");
        });

        document.getElementById("reset-button").addEventListener("auxclick", () => {
            useSaveHandler().reset(true);
            location.reload();
        });

        document.getElementById("reset-button").addEventListener("click", () => {
            useSaveHandler().reset();
            location.reload();
        });

        this.updateBottomBar();
    }

    public static updateDarkMode() {
        document.body.classList.toggle("dark-mode", useSettings().display.settings.darkNavigation.value);
    }

    public static updateBottomBar() {
        const bottomBar = document.getElementById("bottom-bar");
        bottomBar.classList.toggle("reverse", useSettings().display.settings.reverseBottomBar.value);
    }

    public static getActiveStage(): string {
        const activeTab = document.querySelector("stage-tab.active");
        if (activeTab) {
            return activeTab.id.replace("tab-", "");
        } else {
            return "";
        }
    }

    public static switchStageTab(tab: string | StageTabElement) {
        const target = typeof tab === "string" ? document.getElementById(`tab-${tab}`) as StageTabElement : tab;
        if (target?.classList.contains("active")) return;
        const active = document.querySelector("stage-tab.active") as StageTabElement;
        active?.close();
        target.open();
    }

    public static openSubTab(tab: string | HTMLElement) {
        const target = typeof tab === "string" ? document.getElementById(tab) : tab;
        if (!target) return;
        const content = target.closest("stage-tab").querySelector(`.tab[data-tab="${target.dataset.tab}"]`);
        const bg = target.closest("stage-tab").querySelector(".tab-background");
        target.classList.add("active");
        content.classList.add("active");
        bg?.classList.add("active");
    }

    public static closeSubTab(tab: string | HTMLElement) {
        const target = typeof tab === "string" ? document.getElementById(tab) : tab;
        if (!target) return;
        const content = document.querySelector("stage-tab .tab.active");
        const bg = target.closest("stage-tab").querySelector(".tab-background");
        target?.classList.remove("active");
        content?.classList.remove("active");
        bg?.classList.remove("active");
    }

    public static switchSubTab(tab: string | HTMLElement) {
        const active = document.querySelector(".sub-tabs .active") as HTMLElement;
        if (active) this.closeSubTab(active);
        this.openSubTab(tab);
    }

    private static updateMouseState(e: MouseEvent) {
        let flags = e.buttons !== undefined ? e.buttons : e.which;
        UI.mouseDown = (flags & 1) === 1;
        UI.mouseX = e.clientX;
        UI.mouseY = e.clientY;
    }

    private static updateTouchState(e: TouchEvent) {
        if (e.type === "touchend" || e.type === "touchcancel") {
            UI.mouseDown = false;
            return;
        }

        const touch = e.touches[0];
        if (touch) {
            UI.mouseDown = true;
            UI.mouseX = touch.clientX;
            UI.mouseY = touch.clientY;
        }
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

    public static selectStartingTab() {
        const version = useSave().gameVersion;
        if (version && Utils.compareVersions(version, Utils.getVersionString()) < 0) {
            document.getElementById("tab-version").classList.add("updated");
            UI.switchStageTab("version");
        } else {
            UI.switchStageTab("quantum");
        }
    }

    public static spawnGainElement(
        container: string,
        hash: string,
        amount: Decimal,
        x: number,
        y: number,
        showRipple: boolean = false,
        className?: string
    ) {
        let resolvedClass = className;

        if (!resolvedClass) {
            const currency = useCurrency(hash) as Currency;
            if (!currency || currency.inferred) {
                Logger.error("spawnGainElement()", `"${hash}" is inferred`);
                return;
            }
            resolvedClass = currency.className;
        }

        const element = document.createElement("resource-gain");
        element.setAttribute("x", x + "");
        element.setAttribute("y", y + "");
        element.setAttribute("data-class", resolvedClass);
        element.setAttribute("amount", Numbers.getFormatted(amount));
        if (showRipple) element.setAttribute("ripple", "true");

        if (UI.currencyContainerMap.has(container)) {
            UI.currencyContainerMap.get(container).appendChild(element);
        } else {
            const containerElement = document.getElementById(container);
            if (containerElement) {
                containerElement.appendChild(element);
                UI.currencyContainerMap.set(container, containerElement);
            }
        }
    }

    public static createIcon(name: string): SVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", `#${name}`);
        svg.appendChild(use);
        return svg;
    }
}
