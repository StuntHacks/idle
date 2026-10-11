import { IconElement } from "./elements/IconElement";
import { requireElement } from "utils/dom";

class TutorialManager {
    private container: HTMLElement;

    constructor() {
        this.container = requireElement("tutorial-container");
    }

    public show(tutorial: string) {
        
    }
}

let _instance: TutorialManager;
export const useTutorial = (tutorial: string) => {
    if (!_instance) throw new Error("Call initTutorials() first");
    _instance.show(tutorial);
};
export const initTutorials = () => {
    _instance = new TutorialManager();
    return;
};
