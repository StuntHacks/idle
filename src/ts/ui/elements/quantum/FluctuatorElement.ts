import { requireChild } from "utils/dom";
type ToggleCallback = (force?: boolean) => void;

export class FluctuatorElement extends HTMLElement {
    private disableButton!: HTMLSpanElement;
    private upgradeButton!: HTMLElement;
    private intervalElement!: HTMLSpanElement;
    private costElement!: HTMLSpanElement;
    private toggleCallback?: ToggleCallback;
    private upgradeCallback?: () => void;

    public setUpgradeEnabled(enabled: boolean) {
        this.upgradeButton.classList.toggle("disabled", !enabled);
    }

    public setEnabled(enabled: boolean) {
        this.toggleAttribute("disabled", !enabled);
    }

    public setLocked(locked: boolean) {
        this.toggleAttribute("locked", locked);
    }

    public setUpgradeCallback(upgradeCallback: () => void) {
        if (!this.upgradeCallback) {
            this.upgradeCallback = upgradeCallback;
            this.upgradeButton.addEventListener("click", () => this.upgradeCallback?.());
        }
    }

    public setToggleCallback(toggleCallback: ToggleCallback) {
        if (!this.toggleCallback) {
            this.toggleCallback = toggleCallback;
            this.disableButton.addEventListener("click", () => this.toggleCallback?.());
        }
    }

    public setInterval(interval: number) {
        this.intervalElement.textContent = `${interval.toFixed(0)}ms`;
    }

    public setCost(cost: string) {
        this.costElement.textContent = cost;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.intervalElement = requireChild(this, ".interval > span");
        this.costElement = requireChild(this, ".cost");
        this.upgradeButton = requireChild(this, ".upgrade-button");
        this.disableButton = requireChild(this, ".disable-button");
    }
}
