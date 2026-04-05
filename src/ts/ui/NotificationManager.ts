export interface NotificationModel {
    title: string;
    content?: string;
    icon?: string;
    onClick?: () => void;
}

class NotificationManager {
    private container: HTMLElement;

    constructor() {
        this.container = document.getElementById("notification-container");
    }

    public show(notification: NotificationModel) {
        const element = document.createElement("div");
        element.className = "notification";

        const title = document.createElement("span");
        title.classList.add("title");
        title.textContent = notification.title;

        if (notification.icon) {
            const icon = document.createElement("i");
            icon.className = "material-symbols-outlined";
            icon.textContent = notification.icon;
            title.prepend(icon);
        }

        element.appendChild(title);

        if (notification.content) {
            const content = document.createElement("p");
            content.textContent = notification.content;
            element.appendChild(content);
        }

        const dismiss = () => {
            element.classList.add("dismissed");
            setTimeout(() => {
                element.remove();
            }, 300);
        }

        const timeout = setTimeout(dismiss, 5000);
        element.addEventListener("mouseenter", () => clearTimeout(timeout));
        element.addEventListener("mouseleave", () => setTimeout(dismiss, 2000));
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
