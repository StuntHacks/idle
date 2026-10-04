import { requireChild } from "utils/dom";
export class FieldsTabUI {
    public static initialize() {
        const tab = requireChild(document, ".tab[data-tab='fields']");
        tab.querySelectorAll(".field-label").forEach((label) => {
            label.addEventListener("click", () => {
                tab.classList.remove("active");
                requireChild(document, ".tab-background").classList.remove("active");
            });
        });
    }

    public static open(e: MouseEvent) {
        requireChild(document, ".tab-background").classList.add("active");
        const tab = requireChild(document, ".tab[data-tab='fields']");
        tab.classList.add("active");
        tab.dataset.field = (e.target as HTMLDivElement).closest(".field-label").getAttribute("data-field");
    }
}
