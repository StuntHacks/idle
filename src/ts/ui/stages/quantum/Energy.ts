import upgrades from "game_logic/data/upgrades.json";
import { useSave, useSaveHandler } from "SaveHandler/SaveHandler";
import { requireElement } from "utils/dom";

export class EnergyUI {
    private static energyUpgradesElement: HTMLDivElement;

    public static initialize() {
        this.energyUpgradesElement = requireElement<HTMLDivElement>("quantum-energy-upgrades");
        this.populateUpgrades();

        const hideCheckbox = requireElement<HTMLInputElement>("quantum-energy-hide-completed");
        hideCheckbox.checked = useSave((s) => s.stages.quantum.hideCompletedUpgrades.energy);
        hideCheckbox.addEventListener("change", (e) => {
            useSave((s) => {
                s.stages.quantum.hideCompletedUpgrades.energy = (e.target as HTMLInputElement).checked;
            });
        });
    }

    private static populateUpgrades() {
        for (let upgrade of upgrades.quantum.energy.upgrades) {
            const element = document.createElement("stat-upgrade");
            element.setAttribute("namespace", "quantum.energy.upgrades");
            element.setAttribute("upgrade", upgrade.id);
            element.setAttribute("levels", (useSaveHandler().getUpgrades().find((u) => u.id === upgrade.id)?.levels || 0) + "");
            this.energyUpgradesElement.appendChild(element);
        }
    }
}
