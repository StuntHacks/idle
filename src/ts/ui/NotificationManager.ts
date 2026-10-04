import { IconElement } from "./elements/IconElement";
import { requireElement } from "utils/dom";

export interface NotificationModel {
    title: string;
    content?: string;
    icon?: string;
    svg?: string;
    onClick?: () => void;
    timeout?: number;
}

class NotificationManager {
    private container: HTMLElement;

    constructor() {
        this.container = requireElement("notification-container");
    }

    public show(notification: NotificationModel) {
        const element = document.createElement("div");
        element.className = "notification";
        const content = document.createElement("div");
        content.className = "content";

        const title = document.createElement("span");
        title.classList.add("title");
        title.textContent = notification.title;

        if (notification.icon) {
            const icon = document.createElement("i");
            icon.className = "material-symbols-outlined";
            icon.textContent = notification.icon;
            title.prepend(icon);
        }

        content.appendChild(title);
        
        if (notification.svg) {
            const icon = new IconElement(notification.svg);
            element.prepend(icon);
        }

        if (notification.content) {
            const paragraph = document.createElement("p");
            paragraph.textContent = notification.content;
            content.appendChild(paragraph);
        }

        element.appendChild(content);

        let dismissed = false;
        const dismiss = () => {
            if (dismissed) return;
            dismissed = true;
            clearTimeout(timeout);
            element.classList.add("dismissed");
            setTimeout(() => {
                element.remove();
            }, 300);
        }

        const duration = notification.timeout ?? 5000;
        let timeout = setTimeout(dismiss, duration);
        element.addEventListener("mouseenter", () => clearTimeout(timeout));
        element.addEventListener("mouseleave", () => {
            clearTimeout(timeout);
            timeout = setTimeout(dismiss, duration / 2);
        });
        element.addEventListener("click", () => { if (notification.onClick) notification.onClick(); dismiss(); });

        const closeButton = document.createElement("i");
        closeButton.className = "material-symbols-outlined";
        closeButton.textContent = "close";
        closeButton.addEventListener("click", (e) => { e.stopPropagation(); dismiss(); });
        element.appendChild(closeButton);
        this.container.appendChild(element);
        setTimeout(() => element.style.setProperty("--height", `-${element.clientHeight + 16}px`), 0);
    }
}

let _instance: NotificationManager;
export const useNotif = (notification: NotificationModel) => {
    if (!_instance) throw new Error("Call initNotifications() first");
    _instance.show(notification);
};
export const initNotifications = () => {
    _instance = new NotificationManager();
    return;
};
