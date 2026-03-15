export class SystemTabElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const subTabs = this.querySelector("nav.sub-tabs");
        if (!subTabs) return;

        const background = this.querySelector(".tab-background");
        const tabs = subTabs.getElementsByTagName("span");
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", (e: MouseEvent) => {
                const target = (e.target as HTMLElement).closest("nav.sub-tabs span") as HTMLSpanElement;
                if (!target.classList.contains("disabled")) {
                    const tab = this.querySelector(`section.tab[data-tab="${target.dataset.tab}"]`);
                    if (target.classList.contains("active")) {
                        target.classList.remove("active");
                        tab.classList.remove("active");
                        background.classList.remove("active");
                    } else {
                        const sectiontabs = this.querySelectorAll("section.tab");
                        const tabHeaders = target.closest(".sub-tabs").querySelectorAll("span");

                        sectiontabs.forEach(e => e.classList.remove("active"));
                        tabHeaders.forEach(e => e.classList.remove("active"));

                        target.classList.add("active");
                        tab.classList.add("active");
                        background.classList.add("active");
                        target.classList.remove("new");
                    }
                }
            });
        }
    }
}
