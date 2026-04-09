import { UI } from "ui/UI";

export class IconElement extends HTMLElement {
    private name: string;

    constructor(name?: string) {
        super();
        this.name = name ?? null;
    }

    connectedCallback() {
        this.name = this.name ?? (this.getAttribute("name") || "");
        this.appendChild(UI.createIcon(this.name));
    }
}
