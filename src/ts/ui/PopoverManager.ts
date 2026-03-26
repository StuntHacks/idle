import { PopoverElement } from "./elements/PopoverElement";
import { ExportPopover } from "./popovers/ExportPopover";

class PopoverManager {
    private container: HTMLElement;
    private queue: PopoverElement[] = [];

    private initPopovers() {
        customElements.define("pop-over", PopoverElement);
        customElements.define("export-pop-over", ExportPopover);
    }

    constructor() {
        this.initPopovers();
        this.container = document.getElementById("popover-container");
    }

    public add(popover: PopoverElement) {
        this.queue.push(popover);
        if (this.queue.length === 1) {
            this.container.appendChild(this.queue[0]);
        }
    }

    public next() {
        this.queue.shift(); // remove the just-finished one
        if (this.queue.length === 0) return;
        this.container.appendChild(this.queue[0]); // show next without removing it
    }

    public isActive() {
        return this.queue.length > 0;
    }

    public close() {
        if (this.isActive()) this.queue[0].dismiss();
    }
}

let _instance: PopoverManager;
export const usePopover = (popover: PopoverElement) => {
    if (!_instance) throw new Error("Call initPopoverManager() first");
    _instance.add(popover);
};
export const usePopoverManager = (): PopoverManager => {
    if (!_instance) throw new Error("Call initPopoverManager() first");
    return _instance;
};
export const initPopoverManager = () => {
    _instance = new PopoverManager();
    return;
};
