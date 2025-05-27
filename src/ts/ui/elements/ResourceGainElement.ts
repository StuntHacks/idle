export class ResourceGainElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.style.left = this.getAttribute("x") + "px";
        this.style.top = this.getAttribute("y") + "px";

        let className = this.getAttribute("data-class");
        let particle = document.createElement("div");
        particle.classList.add("resource");
        particle.classList.add(...className.split(" "));

        this.addEventListener("animationend", () => {
            this.remove();
        });

        let amount = document.createElement("span");
        amount.innerText = ` + ${this.getAttribute("amount")}`;

        this.appendChild(particle);
        this.appendChild(amount);
    }
}
