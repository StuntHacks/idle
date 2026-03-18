let activeTooltip: ToolTip | null = null;

export class ToolTip extends HTMLElement {
    private host: HTMLElement;
    private container: HTMLDivElement;
    private onMouseEnter: () => void;
    private onMouseLeave: () => void;
    private onTouchStart: (e: TouchEvent) => void;
    private onOutsideTouch: (e: TouchEvent) => void;
    private frameId: number | null = null;
    private lastRect: DOMRect | null = null;
    private hovering: boolean = false;
    private visible: boolean = false;

    constructor() {
        super();
    }

    private show() {
        if (activeTooltip && activeTooltip !== this) {
            activeTooltip.hide();
        }

        activeTooltip = this;
        this.hovering = true;
        this.syncPosition();
        this.startTracking();
    }

    private hide() {
        if (activeTooltip === this) {
            activeTooltip = null;
        }
        this.hovering = false;
        this.stopTracking();
    }

    connectedCallback() {
        this.container = document.getElementById("tooltip-container") as HTMLDivElement;
        if (this.parentElement !== this.container) {
            this.host = this.parentElement!;
            this.container.appendChild(this);
        }
        this.syncPosition();

        this.onMouseEnter = () => this.show();
        this.onMouseLeave = () => this.hide();

        this.onTouchStart = (e: TouchEvent) => {
            e.stopPropagation();
            this.show();
        };
        this.onOutsideTouch = () => {
            if (this.hovering) {
                this.hide();
            }
        };

        this.host.addEventListener("mouseenter", this.onMouseEnter);
        this.host.addEventListener("mouseleave", this.onMouseLeave);
        this.host.addEventListener("touchstart", this.onTouchStart, { passive: true });
        document.addEventListener("touchstart", this.onOutsideTouch, { passive: true });
    }

    disconnectedCallback() {
        this.host?.removeEventListener("mouseenter", this.onMouseEnter);
        this.host?.removeEventListener("mouseleave", this.onMouseLeave);
        this.host?.removeEventListener("touchstart", this.onTouchStart);
        document.removeEventListener("touchstart", this.onOutsideTouch);
        this.stopTracking();
    }

    private setVisibility(visible: boolean) {
        if (this.visible !== visible) {
            this.visible = visible;
            this.classList.toggle("visible", visible);
        }
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
                x = this.getX(rect, align);
                this.style.transform = this.getTransformBottom(align);
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
                x = this.getX(rect, align);
                this.style.transform = this.getTransformTop(align);
                break;
        }

        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
    }

    private startTracking() {
        const track = () => {
            const hidden = this.host.matches(".sub-tabs .active");

            if (hidden) {
                this.setVisibility(false);
            } else {
                const rect = this.host.getBoundingClientRect();
                const moved =
                    !this.lastRect ||
                    rect.top    !== this.lastRect.top  ||
                    rect.left   !== this.lastRect.left ||
                    rect.width  !== this.lastRect.width ||
                    rect.height !== this.lastRect.height;

                if (moved) {
                    this.lastRect = rect;
                    this.syncPosition();
                }

                if (this.hovering) {
                    this.setVisibility(true);
                }
            }

            if (this.hovering) {
                this.frameId = requestAnimationFrame(track);
            }
        };

        this.frameId = requestAnimationFrame(track);
    }

    private stopTracking() {
        this.setVisibility(false);
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.lastRect = null;
    }

    private getX(rect: DOMRect, align: string | null): number {
        switch (align) {
            case "left": return rect.left;
            case "right": return rect.right;
            default: return rect.left + rect.width / 2;
        }
    }

    private getTransformTop(align: string | null): string {
        switch (align) {
            case "left": return "translateY(-100%)";
            case "right": return "translate(-100%, -100%)";
            default: return "translate(-50%, -100%)";
        }
    }

    private getTransformBottom(align: string | null): string {
        switch (align) {
            case "left": return "none";
            case "right": return "translateX(-100%)";
            default: return "translateX(-50%)";
        }
    }
}
