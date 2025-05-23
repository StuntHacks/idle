import { translations } from "../../i18n/i18n";
import { Settings } from "../../utils/Settings";
import { Utils } from "../../utils/utils";

export class ResourceGainElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.style.top = this.getAttribute("x") + "px";
        this.style.left = this.getAttribute("y") + "px";

        let type = this.getAttribute("type");
        let particle = document.createElement("div");
        particle.classList.add("particle");
        particle.classList.add(type);
        particle.classList.add(this.getAttribute("color"));

        if (["up", "down", "strange", "charm", "top", "bottom"].includes(type)) {
            particle.classList.add("quark");
        }

        let amount = document.createElement("span");
        amount.innerText = ` + ${this.getAttribute("amount")}`;

        this.appendChild(particle)
        this.appendChild(amount)

        setTimeout(() => {
            this.remove();
        }, 2000);
    }
}
