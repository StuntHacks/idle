type ToggleCallback = (force?: boolean) => void;

export class FluctuatorElement extends HTMLElement {
    private disableButton: HTMLSpanElement;
    private upgradeButton: HTMLElement;
    private intervalElement: HTMLSpanElement;
    private toggleCallback: ToggleCallback;
    private upgradeCallback: () => void;

    public setEnabled(enabled: boolean) {
        this.toggleAttribute("disabled", !enabled);
    }

    public setLocked(locked: boolean) {
        this.toggleAttribute("locked", locked);
    }

    public setUpgradeCallback(upgradeCallback: () => void) {
        if (!this.upgradeCallback) {
            this.upgradeCallback = upgradeCallback;
            this.upgradeButton.addEventListener("click", () => this.upgradeCallback());
        }
    }

    public setToggleCallback(toggleCallback: ToggleCallback) {
        if (!this.toggleCallback) {
            this.toggleCallback = toggleCallback;
            this.disableButton.addEventListener("click", () => this.toggleCallback());
        }
    }

    public setInterval(interval: number) {
        this.intervalElement.textContent = `${interval}ms`;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.intervalElement = this.querySelector(".interval") as HTMLSpanElement;
        this.upgradeButton = this.querySelector(".upgrade-button") as HTMLElement;
        this.disableButton = this.querySelector(".disable-button") as HTMLSpanElement;
    }
}
