import { QuantumUI } from "./systems/Quantum";

export class UI {
    public static saveIndicator: HTMLElement;
    public static mouseDown: boolean = false;
    public static mouseX: number = 0;
    public static mouseY: number = 0;
    public static initialize() {
        this.saveIndicator = document.getElementById("save-notif");
        window.requestAnimationFrame(UI.animate);

        window.addEventListener("mousedown", UI.updateMouseState);
        window.addEventListener("mousemove", UI.updateMouseState);
        window.addEventListener("mouseup", UI.updateMouseState);

        const sidescrollers = document.getElementsByClassName("js-sidescroll");
        for (let i = 0; i < sidescrollers.length; i++) {
            const element = sidescrollers[i];
            element.addEventListener('wheel', (event: WheelEvent) => {
                if (event.deltaY !== 0) {
                    event.preventDefault();
                    element.scrollLeft += event.deltaY / 2;
                }
            }, { passive: false });
        }

        QuantumUI.initialize();
    }

    private static updateMouseState(e: MouseEvent) {
        let flags = e.buttons !== undefined ? e.buttons : e.which;
        UI.mouseDown = (flags & 1) === 1;
        UI.mouseX = e.clientX;
        UI.mouseY = e.clientY;
    }

    public static animate(timestamp: number) {
        QuantumUI.update(timestamp);

        window.requestAnimationFrame(UI.animate);
    }

    public static flashSaveIndicator() {
        if (this.saveIndicator) {
            this.saveIndicator.classList.add("shown");

            window.requestAnimationFrame(() => {
                this.saveIndicator.classList.remove("shown");
            });
        }
    }
}
