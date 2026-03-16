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
}
