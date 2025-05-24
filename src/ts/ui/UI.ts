import { Currencies } from "./Currencies";

export namespace UI {
    export const animate = (timestamp: number) => {
        Currencies.updateCurrencies();

        window.requestAnimationFrame(UI.animate);
    }
}
