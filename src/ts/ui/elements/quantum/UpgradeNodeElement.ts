import { UpgradeDef } from "types/SaveFile";
import { IconElement } from "../IconElement";
import { useStat } from "game_logic/StatHandler";

export class UpgradeNodeElement extends HTMLElement {
    private upgrade: UpgradeDef;

    constructor(upgrade: UpgradeDef) {
        super();
        this.upgrade = upgrade;
    }

    connectedCallback() {
        if (!this.upgrade) return;
        this.dataset.id = this.upgrade.id;
        this.appendChild(new IconElement(
            this.upgrade.icon ?? useStat(this.upgrade.target)?.icon
        ));
    }
}
