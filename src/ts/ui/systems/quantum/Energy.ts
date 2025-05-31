import { SaveHandler } from "SaveHandler/SaveHandler";
import upgrades from "game_logic/data/upgrades.json";

export class EnergyUI {
    private static energyUpgradesElement: HTMLDivElement;

    public static initialize() {
        this.energyUpgradesElement = document.getElementById("quantum-energy-upgrades") as HTMLDivElement;
        this.populateUpgrades();
    }

    private static populateUpgrades() {
        for (let upgrade of upgrades.quantum.energy.upgrades) {
            const element = document.createElement("stat-upgrade");
            element.setAttribute("namespace", "quantum.energy.upgrades");
            element.setAttribute("upgrade", upgrade.id);
            element.setAttribute("levels", (SaveHandler.getUpgrades().find((u) => u.id === upgrade.id)?.levels || 0) + "");
            this.energyUpgradesElement.appendChild(element);
        }
    }

    public static update(timestamp: number) {
        
    }
}
