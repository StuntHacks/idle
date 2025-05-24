import { Currencies } from "./Currencies";

export class UI {
    public static saveIndicator: HTMLElement;

    public static initialize() {
        console.log(this.saveIndicator)
        this.saveIndicator = document.getElementById("save-notif");
        console.log(this.saveIndicator)
        window.requestAnimationFrame(UI.animate);
    }

    public static animate(timestamp: number) {
        Currencies.updateCurrencies();

        window.requestAnimationFrame(UI.animate);
    }

    public static flashSaveIndicator() {
        this.saveIndicator.classList.add("shown");

        window.requestAnimationFrame(() => {
            this.saveIndicator.classList.remove("shown");
        });
    }
}
