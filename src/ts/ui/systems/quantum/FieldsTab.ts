export class FieldsTabUI {
    public static initialize() {
        const tab = document.querySelector(".tab[data-tab='fields']") as HTMLDivElement;
        tab.querySelectorAll(".field-label").forEach((label) => {
            label.addEventListener("click", () => {
                tab.classList.remove("active");
                document.querySelector(".tab-background").classList.remove("active");
            });
        });
    }

    public static open(e: MouseEvent) {
        document.querySelector(".tab-background").classList.add("active");
        const tab = document.querySelector(".tab[data-tab='fields']") as HTMLDivElement;
        tab.classList.add("active");
        tab.dataset.field = (e.target as HTMLDivElement).closest(".field-label").getAttribute("data-field");
    }
}
