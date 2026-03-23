import { PopoverElement } from "./elements/PopoverElement";

export class PopoverManager {
    private static container: HTMLElement;
    private static queue: PopoverElement[] = [];

    public static initialize() {
        customElements.define("pop-over", PopoverElement);
        this.container = document.getElementById("popover-container");
    }

    public static add(popover: PopoverElement) {
        this.queue.push(popover);
        if (this.queue.length === 1) {
            this.container.appendChild(this.queue[0]);
        }
    }

    public static next() {
        this.queue.shift(); // remove the just-finished one
        if (this.queue.length === 0) return;
        this.container.appendChild(this.queue[0]); // show next without removing it
    }

    public static isActive() {
        return this.queue.length > 0;
    }

    public static close() {
        if (this.isActive()) this.queue[0].dismiss();
    }
}
