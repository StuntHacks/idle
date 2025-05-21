
import { TranslatedElement, translations } from "./i18n/i18n";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";

export const mainFunction = () => {
    
    SaveHandler.initialize();
    
    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }
    
    let data = SaveHandler.getData();
    Settings.set(data.settings);
    console.log(Settings.get().debug.settings.verbose.value)
    Settings.get().debug.settings.verbose.value = true;
    console.log(Settings.get().debug.settings.verbose.value)
    console.log(Settings.get())
    
    customElements.define("translated-string", TranslatedElement);

    document.getElementsByTagName("body")[0].classList.remove("loading");
}
