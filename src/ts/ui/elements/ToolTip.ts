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

    private tipWidth: number = 0;
    private tipHeight: number = 0;

    private show() {
        if (activeTooltip && activeTooltip !== this) {
            activeTooltip.hide();
        }

        activeTooltip = this;
        this.hovering = true;

        if (this.tipWidth === 0) {
            this.style.opacity = "0";
            this.style.visibility = "hidden";
            this.classList.add("visible");
            this.tipWidth = this.offsetWidth;
            this.tipHeight = this.offsetHeight;
            this.classList.remove("visible");
            this.style.opacity = "";
            this.style.visibility = "";
        }

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
        let MARGIN_X = 5;
        let MARGIN_Y = 5;

        if (this.hasAttribute("margin")) {
            if (this.getAttribute("margin").includes(",")) {
                const parts = this.getAttribute("margin").split(",");
                MARGIN_X = parseInt(parts[0].trim());
                MARGIN_Y = parseInt(parts[1].trim());
            } else {
                MARGIN_X = MARGIN_Y = parseInt(this.getAttribute("margin"));
            }
        }

        if (this.host.tagName.toLowerCase() === "currency-display") {
            MARGIN_X = MARGIN_Y = 10;
        }

        const orientation = this.getAttribute("orientation") ?? "top";
        const align = this.getAttribute("align");
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const tw = this.tipWidth;
        const th = this.tipHeight;

        let x: number;
        let y: number;

        switch (orientation) {
            case "bottom":
                y = rect.bottom + MARGIN_Y;
                x = this.getX(rect, align, tw);
                break;
            case "left":
                y = rect.top + rect.height / 2 - th / 2;
                x = rect.left - MARGIN_X - tw;
                break;
            case "right":
                y = rect.top + rect.height / 2 - th / 2;
                x = rect.right + MARGIN_X;
                break;
            case "top":
            default:
                y = rect.top - MARGIN_Y - th;
                x = this.getX(rect, align, tw);
                break;
        }

        if (tw > 0) {
            x = Math.max(MARGIN_X, Math.min(x, vw - tw - MARGIN_X));
            y = Math.max(MARGIN_Y, Math.min(y, vh - th - MARGIN_Y));
        }

        this.style.transform = "none";
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

    private getX(rect: DOMRect, align: string | null, tooltipWidth: number): number {
        switch (align) {
            case "left":  return rect.left;
            case "right": return rect.right - tooltipWidth;
            default:      return rect.left + rect.width / 2 - tooltipWidth / 2;
        }
    }
}
