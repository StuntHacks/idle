export class ToolTip extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.parentElement.style.position = "relative";
    }
}
