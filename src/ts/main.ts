
import { TranslatedElement, translations } from "./i18n/i18n";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";

export const main = () => {
    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    customElements.define("translated-string", TranslatedElement);

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
}
