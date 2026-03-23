import { Translator } from "i18n/i18n";
import { PopoverManager } from "ui/PopoverManager";

export interface PopoverButton {
    label: string;
    callback?: () => boolean | void;
    type?: "primary" | "secondary";
};

export class PopoverElement extends HTMLElement {
    private container: HTMLElement;
    private callback: () => void;
    protected buttons: PopoverButton[] = [];
    private popoverTitle: string;
    private content: string;
    private noDismiss: boolean;

    constructor(title: string, content: string, noDismiss: boolean = false, buttons?: PopoverButton[], callback?: () => void) {
        super();
        this.callback = callback ?? (() => {});
        this.popoverTitle = title;
        this.content = content;
        this.noDismiss = noDismiss;
        this.buttons = buttons ?? [{ label: "misc.ok" }];
    }

    public dismiss = () => {
        this.container.removeEventListener("click", this.handleOverlayClick);
        document.removeEventListener("keydown", this.handleEscapePress);
        this.callback();
        PopoverManager.next();
        this.classList.add("dismissed");
        setTimeout(() => this.remove(), PopoverManager.isActive() ? 0 : 150);
    }

    private handleOverlayClick = () => {
        this.dismiss();
    }

    private handleEscapePress = (e: KeyboardEvent) => {
        console.log(e);
        if (e.key === "Escape") {
            this.dismiss();
            e.stopPropagation();
        }
    }

    connectedCallback() {
        this.container = document.getElementById("popover-container");
        if (!this.noDismiss) {
            this.container.addEventListener("click", this.handleOverlayClick);
            document.addEventListener("keydown", this.handleEscapePress);
        }
        this.addEventListener("click", (e: MouseEvent) => e.stopPropagation());

        const title = document.createElement("h1");
        title.innerText = Translator.getTranslation(this.popoverTitle);
        this.appendChild(title);

        const content = document.createElement("div");
        content.classList.add("content");
        content.innerHTML = this.content;
        this.appendChild(content);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("popover-buttons");
        this.appendChild(buttonContainer);

        for (const button of this.buttons) {
            const b = document.createElement("button");
            b.textContent = Translator.getTranslation(button.label);
            b.addEventListener("click", () => {
                if (button.callback?.() !== false) {
                    this.dismiss();
                }
            });
            b.classList.add(button.type ?? "secondary");
            buttonContainer.appendChild(b);
        }
    }
}
