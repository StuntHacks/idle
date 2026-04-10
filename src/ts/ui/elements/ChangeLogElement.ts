import changelog from "game_logic/data/changelog.json";

interface ChangeLogEntry {
    version: string;
    date: string;
    changes: string[];
}

const typedChangelog: ChangeLogEntry[] = changelog as ChangeLogEntry[];

export class ChangeLogElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        for (const entry of typedChangelog) {
            const versionHeader = document.createElement("h3");
            versionHeader.textContent = entry.version;

            const date = document.createElement("span");
            date.classList.add("date");
            date.textContent = entry.date;
            versionHeader.appendChild(date);

            const changes = document.createElement("ul");
            for (const change of entry.changes) {
                const changeItem = document.createElement("li");
                changeItem.textContent = change;
                changes.appendChild(changeItem);
            }

            this.prepend(changes);
            this.prepend(versionHeader);
        }
    }
}
