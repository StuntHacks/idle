import { SaveHandler } from "./savehandler/SaveHandler";
import { Settings } from "./utils/Settings";

export const mainFunction = () => {
    SaveHandler.initialize();

    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);
    console.log(Settings.get())
}
