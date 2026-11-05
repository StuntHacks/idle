import upgrades from "game_logic/data/upgrades.json";
import { useSave } from "SaveHandler/SaveHandler";
import { useStatHandler } from "game_logic/StatHandler";
import { requireElement } from "utils/dom";
import { TranslatedElement } from "ui/elements/TranslatedElement";
import { UpgradeElement } from "ui/elements/UpgradeElement";

export class EnergyUI {
    private static energyUpgradesElement: HTMLDivElement;
    private static conversionEnergyTooltip: TranslatedElement;
    private static upgradeElements: UpgradeElement[] = [];

    public static initialize() {
        this.energyUpgradesElement = requireElement<HTMLDivElement>("quantum-energy-upgrades");
        this.conversionEnergyTooltip = requireElement<TranslatedElement>("conversion-energy-scaling");
        this.populateUpgrades();

        const hideCheckbox = requireElement<HTMLInputElement>("quantum-energy-hide-completed");
        hideCheckbox.checked = useSave((s) => s.stages.quantum.hideCompletedUpgrades.energy);
        hideCheckbox.addEventListener("change", (e) => {
            useSave((s) => {
                s.stages.quantum.hideCompletedUpgrades.energy = (e.target as HTMLInputElement).checked;
            });
        });

        requireElement<HTMLButtonElement>("quantum-energy-buy-max").addEventListener("click", () => {
            for (let upgradeElement of this.upgradeElements) {
                upgradeElement.buy(-1);
            }
        });
    }

    private static populateUpgrades() {
        for (let upgrade of upgrades.quantum.energy.upgrades) {
            const element = document.createElement("stat-upgrade");
            element.setAttribute("namespace", "quantum.energy.upgrades");
            element.setAttribute("upgrade", upgrade.id);
            element.setAttribute("levels", useStatHandler().getUpgradeLevel(upgrade.id) + "");
            this.energyUpgradesElement.appendChild(element);
            this.upgradeElements.push(element as UpgradeElement);
        }
    }
}
