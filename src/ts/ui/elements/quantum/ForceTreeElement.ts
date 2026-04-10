import upgradeData from "game_logic/data/upgrades.json";
import { UpgradeDef } from "types/SaveFile";
import { UpgradeNodeElement } from "./UpgradeNodeElement";

export class ForceTreeElement extends HTMLElement {
    private connectionElement: SVGElement;
    private sectionElement: HTMLElement;
    private upgrades: UpgradeDef[];
    private layout: (string | null)[][];
    private resizeObserver: ResizeObserver;

    constructor() {
        super();
    }

    private drawConnections() {
        const sectionRect = this.sectionElement.getBoundingClientRect();
        this.connectionElement.innerHTML = '';

        const positions: Record<string, { x: number; y: number }> = {};
        for (const id of this.upgrades.map(upgrade => upgrade.id)) {
            const element = this.sectionElement.querySelector(`[data-id="${id}"]`);
            if (!element) continue;
            const r = element.getBoundingClientRect();
            positions[id] = {
                x: r.left + r.width / 2 - sectionRect.left,
                y: r.top + r.height / 2 - sectionRect.top
            };
        }

        for (const upgrade of this.upgrades) {
            if (!upgrade.requirements) continue;
            const to = positions[upgrade.id];
            if (!to) continue;
            for (const req of upgrade.requirements) {
                const from = positions[req];
                if (!from) continue;
                const half = 75 / 2;
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const sameRow = Math.abs(from.y - to.y) < 1;
                let d: string;
                if (sameRow) {
                    const leftNode = from.x < to.x ? from : to;
                    const rightNode = from.x < to.x ? to : from;
                    d = `M ${leftNode.x + half} ${leftNode.y} L ${rightNode.x - half} ${rightNode.y}`;
                } else {
                    const x1 = from.x, y1 = from.y - half;
                    const x2 = to.x, y2 = to.y + half;
                    const midY = (y1 + y2) / 2;
                    d = Math.abs(x1 - x2) < 1
                        ? `M ${x1} ${y1} L ${x2} ${y2}`
                        : `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
                }
                path.setAttribute('d', d);
                path.setAttribute('stroke', '#555');
                path.setAttribute('stroke-width', '4');
                path.setAttribute('fill', 'none');
                this.connectionElement.appendChild(path);
            }
        }
    }

    private populateUpgrades() {
        if (!this.layout || !this.upgrades) return;
        const rows = [];
        for (const row of this.layout) {
            const rowElement = document.createElement("div");
            rowElement.classList.add("row");

            for (const entry of row) {
                if (entry === null) {
                    const spacer = document.createElement("div");
                    spacer.classList.add("spacer");
                    rowElement.appendChild(spacer);
                    continue;
                }

                const upgradeElement = new UpgradeNodeElement(this.upgrades.find(u => u.id === entry));
                rowElement.appendChild(upgradeElement);
            }

            rows.push(rowElement);
        }

        for (const row of rows) {
            this.sectionElement.appendChild(row);
        }
    }

    connectedCallback() {
        this.sectionElement = this.querySelector(".section");
        this.connectionElement = this.querySelector("svg.connections");
        const data = upgradeData.quantum.forces[this.className as "strong" | "weak" | "electromagnetic"];
        this.upgrades = data?.upgrades as UpgradeDef[];
        this.layout = data?.layout;
        this.populateUpgrades();
        this.drawConnections();

        this.resizeObserver = new ResizeObserver(() => this.drawConnections());
        this.resizeObserver.observe(this.sectionElement);
    }

    disconnectedCallback() {
        this.resizeObserver?.disconnect();
    }
}
