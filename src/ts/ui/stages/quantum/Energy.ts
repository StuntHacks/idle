import upgrades from "game_logic/data/upgrades.json";
import { useSaveHandler } from "SaveHandler/SaveHandler";

export class EnergyUI {
    private static energyUpgradesElement: HTMLDivElement;
    private static subtab: HTMLElement;
    private static subtabContent: HTMLElement;
    private static showNotif: boolean = false;

    public static initialize() {
        this.energyUpgradesElement = document.getElementById("quantum-energy-upgrades") as HTMLDivElement;
        this.populateUpgrades();

        this.subtabContent = document.querySelector('.tab[data-tab="energy"]');
        this.subtab = document.getElementById("quantum-tab-energy");

        window.requestAnimationFrame(this.updateEnergyNotif);
    }

    public static updateEnergyNotif = () => {
        const check = () => {
            return (
                this.subtabContent.querySelector("stat-upgrade:not(.disabled):not(.completed)")
            )
        }

        if (check()) {
            if (!this.showNotif) {
                this.showNotif = true;
                this.subtab.classList.add("new");
            }
        } else {
            if (this.showNotif) {
                this.showNotif = false;
                this.subtab.classList.remove("new");
            }
        }

        window.requestAnimationFrame(this.updateEnergyNotif);
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
