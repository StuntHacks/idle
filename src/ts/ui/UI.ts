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
    }

    private static updateMouseState(e: MouseEvent) {
        let flags = e.buttons !== undefined ? e.buttons : e.which;
        UI.mouseDown = (flags & 1) === 1;
        UI.mouseX = e.clientX;
        UI.mouseY = e.clientY;
    }

    public static animate(timestamp: number) {
        window.requestAnimationFrame(UI.animate);
    }

    public static flashSaveIndicator() {
        this.saveIndicator.classList.add("shown");

        window.requestAnimationFrame(() => {
            this.saveIndicator.classList.remove("shown");
        });
    }
}
