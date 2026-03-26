import { useTranslation } from "i18n/i18n";
import { Setting, Settings as SettingsType } from "types/Settings";
import { TranslatedElement } from "./TranslatedElement";
import { useSettings, useSettingsHandler } from "utils/SettingsHandler";
import { UI } from "ui/UI";

type ST = Omit<SettingsType, "version" | "internal">;

export class SettingsElement extends HTMLElement {
    private category: keyof ST;

    constructor() {
        super();
    }

    public rebuild() {
        this.innerHTML = "";
        const category = useSettings()[this.category];
        const settings = category.settings as Record<string, Setting<unknown>>;
        const title = document.createElement("h1");
        title.textContent = useTranslation(category.title);
        this.appendChild(title);

        for (const key in settings) {
            const settingKey = key as keyof typeof category.settings;
            const setting = settings[key];

            const label = document.createElement("label");
            this.appendChild(label);
            if (setting.platform) label.classList.add(setting.platform);

            const name = document.createElement("span");
            name.textContent = useTranslation(setting.name);
            name.classList.add("name");
            label.appendChild(name);

            if (setting.description) {
                const desc = document.createElement("span");
                desc.textContent = useTranslation(setting.description);
                desc.classList.add("description");
                label.appendChild(desc);
            }

            if (typeof setting.value === "boolean") {
                const input = document.createElement("input");
                input.type = "checkbox";
                label.classList.add("checkbox");
                input.checked = setting.value;
                input.addEventListener("change", () => {
                    useSettingsHandler().setSpecific(this.category, settingKey, input.checked);
                    if (setting.action) this.handleAction(setting.action);
                });
                label.prepend(input);
            } else if (typeof setting.value === "string") {
                const select = document.createElement("select");
                select.id = setting.name;

                if (setting.options) {
                    for (const option of setting.options) {
                        const element = document.createElement("option");
                        element.value = option.value as string;
                        element.textContent = useTranslation(option.name);
                        if (setting.value === option.value) element.selected = true;
                        select.appendChild(element);
                    }
                }

                select.addEventListener("change", () => {
                    useSettingsHandler().setSpecific(this.category, settingKey, select.value);
                    if (setting.action) this.handleAction(setting.action);
                });
                label.appendChild(select);
            }
        }
    }

    connectedCallback() {
        this.category = this.getAttribute("for") as keyof ST;
        this.rebuild();
    }

    private handleAction(action: string) {
        switch (action) {
            case "updateLanguage":
                // todo: update other elements that dont directly use translated-strings
                // currently in: SettingsElement, ...
                document.querySelectorAll("translated-string").forEach((el: TranslatedElement) => el.refresh());
                document.querySelectorAll("settings-block").forEach((el: SettingsElement) => el.rebuild());
                break;
            case "darkenNavigation":
                UI.updateDarkMode();
                break;
            case "reverseBottomBar":
                UI.updateBottomBar();
                break;
        }
    }
}
