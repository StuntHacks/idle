export class ResourceGainElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.style.left = this.getAttribute("x") + "px";
        this.style.top = this.getAttribute("y") + "px";

        let type = this.getAttribute("type");
        let flavor = this.getAttribute("flavor");
        let color = this.getAttribute("color");
        let particle = document.createElement("div");
        particle.classList.add("particle");
        particle.classList.add(type);
        particle.classList.add(flavor);
        particle.classList.add(color);

        let amount = document.createElement("span");
        amount.innerText = ` + ${this.getAttribute("amount")}`;

        this.appendChild(particle)
        this.appendChild(amount)

        setTimeout(() => {
            this.remove();
        }, 2000);
    }
}
