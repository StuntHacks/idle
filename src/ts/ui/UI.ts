import { useSave, useSaveHandler } from "SaveHandler/SaveHandler";
import { OfflineProgressUI } from "./OfflineProgress";
import { QuantumUI } from "./stages/Quantum";
import { Utils } from "utils/utils";
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
import { CustomElements } from "./CustomElements";
import { requireChild, requireElement } from "utils/dom";
import { AboutUI } from "./About";

export class UI {
    private static saveIndicator: HTMLElement;
    public static mouseDown: boolean = false;
    public static mouseX: number = 0;
    public static mouseY: number = 0;
    private static lastStageTab: string = "quantum";
    private static currencyContainerMap = new Map<string, HTMLElement>();

    public static initialize() {
        CustomElements.initialize();
        this.saveIndicator = requireElement("save-notif");

        window.addEventListener("mousedown", UI.updateMouseState);
        window.addEventListener("mousemove", UI.updateMouseState);
        window.addEventListener("mouseup", UI.updateMouseState);

        window.addEventListener("touchstart", UI.updateTouchState, { passive: true });
        window.addEventListener("touchmove", UI.updateTouchState, { passive: true });
        window.addEventListener("touchend", UI.updateTouchState, { passive: true });

        for (const element of Array.from(document.querySelectorAll<HTMLElement>(".js-sidescroll"))) {
            element.addEventListener('wheel', (event: WheelEvent) => {
                if (event.deltaY === 0) return;

                const exceptions = `
                    force-tree .section
                `;
                const inner = (event.target as HTMLElement).closest(exceptions);
                if (inner && inner !== element) {
                    return;
                }

                event.preventDefault();
                element.scrollLeft += event.deltaY * 0.75;
            }, { passive: false });
        }

        requireChild(document, "#tab-version .stage-main-content").addEventListener("scroll", (e: Event) => {
            const target = e.target as HTMLElement;
            target.querySelector(".headlines")?.classList.toggle("shadow", target.scrollTop > 0);
        });

        OfflineProgressUI.initialize();
        QuantumUI.initialize();
        SettingsUI.initialize();
        AboutUI.initialize();
        initPopoverManager();
        initNotifications();
        this.initializeBottomBar();
        this.updateDarkMode();
    }

    public static toggleMenuTab(tab: string): boolean {
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
        requireElement("save-button").addEventListener("click", () => {
            useSaveHandler().saveData();
        });

        requireElement("load-button").addEventListener("click", () => {
            usePopover(new ImportPopover());
        });

        requireElement("settings-button").addEventListener("click", () => {
            UI.toggleMenuTab("settings");
        });

        requireElement("about-button").addEventListener("click", () => {
            if (UI.toggleMenuTab("about")) {
                requireElement("tab-about").classList.add("slide-in");
            }
        });

        requireElement("version-number").addEventListener("click", () => {
            UI.toggleMenuTab("version");
        });

        requireElement("reset-button").addEventListener("auxclick", () => {
            useSaveHandler().reset(true);
            useSaveHandler().reloadWithoutSaving();
        });

        requireElement("reset-button").addEventListener("click", () => {
            useSaveHandler().reset();
            useSaveHandler().reloadWithoutSaving();
        });

        this.updateBottomBar();
    }

    public static updateDarkMode() {
        document.body.classList.toggle("dark-mode", useSettings().display.settings.darkNavigation.value);
    }

    public static updateBottomBar() {
        const bottomBar = requireElement("bottom-bar");
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
        const stage = target?.closest("stage-tab");
        if (!target || !stage) return;
        const content = stage.querySelector(`.tab[data-tab="${target.dataset.tab}"]`);
        const bg = stage.querySelector(".tab-background");
        target.classList.add("active");
        content?.classList.add("active");
        bg?.classList.add("active");
    }

    public static closeSubTab(tab: string | HTMLElement) {
        const target = typeof tab === "string" ? document.getElementById(tab) : tab;
        const stage = target?.closest("stage-tab");
        if (!target || !stage) return;
        const content = stage.querySelector(".tab.active");
        const bg = stage.querySelector(".tab-background");
        target.classList.remove("active");
        content?.classList.remove("active");
        bg?.classList.remove("active");
    }

    public static switchSubTab(tab: string | HTMLElement) {
        const target = typeof tab === "string" ? document.getElementById(tab) : tab;
        if (!target) return;
        const active = target.closest("stage-tab")?.querySelector<HTMLElement>(".sub-tabs .active");
        if (active) this.closeSubTab(active);
        this.openSubTab(target);
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
            requireElement("tab-version").classList.add("updated");
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

        const containerElement = UI.currencyContainerMap.get(container) ?? document.getElementById(container);
        if (containerElement) {
            containerElement.appendChild(element);
            UI.currencyContainerMap.set(container, containerElement);
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
