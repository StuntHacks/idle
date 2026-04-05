import upgrades from "game_logic/data/upgrades.json";
import { useSave, useSaveHandler } from "SaveHandler/SaveHandler";

export class EnergyUI {
    private static energyUpgradesElement: HTMLDivElement;

    public static initialize() {
        this.energyUpgradesElement = document.getElementById("quantum-energy-upgrades") as HTMLDivElement;
        this.populateUpgrades();

        const hideCheckbox = document.getElementById("quantum-energy-hide-completed") as HTMLInputElement;
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static update(timestamp: number) {
        
    }
}
