import { Translator } from "i18n/i18n";
import { Setting, Settings as SettingsType } from "types/Settings";
import { Settings } from "utils/Settings";
import { TranslatedElement } from "./TranslatedElement";

type ST = Omit<SettingsType, "internal">;

export class SettingsElement extends HTMLElement {
    private category: keyof ST;

    constructor() {
        super();
    }

    connectedCallback() {
        this.category = (this.getAttribute("for")) as keyof ST;
        const category = Settings.get()[this.category];
        const settings = category.settings as Record<string, Setting<unknown>>;
        const title = document.createElement("h1");
        title.textContent = Translator.getTranslation(category.title);
        this.appendChild(title);

        for (const key in settings) {
            const settingKey = key as keyof typeof category.settings;
            const setting = settings[key];

            const label = document.createElement("label");
            this.appendChild(label);

            const name = document.createElement("span");
            name.textContent = Translator.getTranslation(setting.name);
            label.appendChild(name);

            if (setting.description) {
                const desc = document.createElement("span");
                desc.textContent = Translator.getTranslation(setting.description);
                label.appendChild(desc);
            }

            if (typeof setting.value === "boolean") {
                const input = document.createElement("input");
                input.type = "checkbox";
                input.checked = setting.value;
                input.addEventListener("change", () => {
                    Settings.setSpecific(this.category, settingKey, input.checked);
                    if (setting.action) this.handleAction(setting.action);
                });
                label.appendChild(input);
            } else if (typeof setting.value === "string") {
                const select = document.createElement("select");

                if (setting.options) {
                    for (const option of setting.options) {
                        const element = document.createElement("option");
                        element.value = option.value as string;
                        element.textContent = Translator.getTranslation(option.name);
                        if (setting.value === option.value) element.selected = true;
                        select.appendChild(element);
                    }
                }

                select.addEventListener("change", () => {
                    Settings.setSpecific(this.category, settingKey, select.value);
                    if (setting.action) this.handleAction(setting.action);
                });
                label.appendChild(select);
            }
        }
    }

    private handleAction(action: string) {
        switch (action) {
            case "updateLanguage":
                // todo: update other elements that dont directly use translated-strings
                // currently in: SettingsElement, ...
                const elements = Array.from(document.querySelectorAll("translated-string")) as TranslatedElement[];
                for (const element of elements) {
                    element.refresh();
                }
                break;
        }
    }
}
