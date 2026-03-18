export class ToolTip extends HTMLElement {
    private host: HTMLElement;
    private container: HTMLDivElement;
    private onMouseEnter: () => void;
    private onMouseLeave: () => void;
    private frameId: number | null = null;
    private lastRect: DOMRect | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.container = document.getElementById("tooltip-container") as HTMLDivElement;
        if (this.parentElement !== this.container) {
            this.host = this.parentElement!;
            this.container.appendChild(this);
        }
        this.syncPosition();

        this.onMouseEnter = () => {
            this.syncPosition();
            if (!this.host.matches(".sub-tabs .active")) {
                this.classList.add("visible");
            }
            this.startTracking();
        };
        this.onMouseLeave = () => {
            this.classList.remove("visible");
            this.stopTracking();
        };

        this.host.addEventListener("mouseenter", this.onMouseEnter);
        this.host.addEventListener("mouseleave", this.onMouseLeave);
    }

    disconnectedCallback() {
        this.host?.removeEventListener("mouseenter", this.onMouseEnter);
        this.host?.removeEventListener("mouseleave", this.onMouseLeave);
        this.stopTracking();
    }

    private syncPosition() {
        const rect = this.host.getBoundingClientRect();
        let MARGIN = 5;

        if (this.host.tagName.toLowerCase() === "currency-display") {
            MARGIN = 10;
        }

        const orientation = this.getAttribute("orientation") ?? "top";
        const align = this.getAttribute("align");

        let x: number;
        let y: number;

        switch (orientation) {
           case "bottom":
                y = rect.bottom + MARGIN;
                x = resolveX(rect, align);
                this.style.transform = resolveTransformBottom(align);
                break;
            case "left":
                y = rect.top + rect.height / 2;
                x = rect.left - MARGIN;
                this.style.transform = "translate(-100%, -50%)";
                break;
            case "right":
                y = rect.top + rect.height / 2;
                x = rect.right + MARGIN;
                this.style.transform = "translateY(-50%)";
                break;
            case "top":
            default:
                y = rect.top - MARGIN;
                x = resolveX(rect, align);
                this.style.transform = resolveTransformTop(align);
                break;
        }

        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
    }

    private startTracking() {
        const track = () => {
            const rect = this.host.getBoundingClientRect();

            const moved = (
                !this.lastRect ||
                rect.top !== this.lastRect.top ||
                rect.left !== this.lastRect.left ||
                rect.width !== this.lastRect.width ||
                rect.height !== this.lastRect.height
            );

            if (moved) {
                this.lastRect = rect;
                this.syncPosition();
            }

            this.frameId = requestAnimationFrame(track);
        };

        this.frameId = requestAnimationFrame(track);
    }

    private stopTracking() {
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.lastRect = null;
    }
}

function resolveX(rect: DOMRect, align: string | null): number {
    switch (align) {
        case "left": return rect.left;
        case "right": return rect.right;
        default: return rect.left + rect.width / 2;
    }
}

function resolveTransformTop(align: string | null): string {
    switch (align) {
        case "left": return "translateY(-100%)";
        case "right": return "translate(-100%, -100%)";
        default: return "translate(-50%, -100%)";
    }
}

function resolveTransformBottom(align: string | null): string {
    switch (align) {
        case "left": return "none";
        case "right": return "translateX(-100%)";
        default: return "translateX(-50%)";
    }
}
