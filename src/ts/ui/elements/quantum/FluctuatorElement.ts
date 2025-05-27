export class FluctuatorElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.parentElement.style.position = "relative";
    }
}
