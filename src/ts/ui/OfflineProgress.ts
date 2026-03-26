import { OfflineResults } from "game_logic/Game";
import { TranslatedElement } from "./elements/TranslatedElement";
import { UI } from "./UI";
import { useSettings } from "utils/SettingsHandler";
import { Numbers } from "numbers/numbers";
import { Energy } from "game_logic/currencies/inferred/Energy";
import { Currency, useCurrency } from "game_logic/currencies/Currencies";
import Decimal from "break_eternity.js";

export class OfflineProgressUI {
    static initUI() {
        document.getElementById("offline-progress").classList.add("rendering");
    }
    public static initialize() {
        document.getElementById("offline-progress-button").addEventListener("click", () => OfflineProgressUI.dismiss());
    }

    public static dismiss() {
        UI.selectStartingTab();
        document.getElementById("offline-progress").classList.add("dismissed");
    }

    public static setDuration(duration: string) {
        document.getElementById("offline-duration").textContent = duration;
    }

    public static renderProgress(progress: OfflineResults) {
        void progress;
        progress = {
            "quantum": {
                "particles": [
                    {
                        "hash": "bosons-gluon",
                        "amount": new Decimal(23458749398573987548937893453455345.375)
                    },
                    {
                        "hash": "bosons-photon",
                        "amount": new Decimal(43252456.375)
                    },
                    {
                        "hash": "bosons-z",
                        "amount": new Decimal(23458749398573987548937893453455345.375)
                    },
                    {
                        "hash": "bosons-w-plus",
                        "amount": new Decimal(43252456.375)
                    },
                    {
                        "hash": "bosons-w-minus",
                        "amount": new Decimal(23458749398573987548937893453455345.375)
                    }
                ],
                "inferred": [
                    {
                        "hash": "energy",
                        "amount": new Decimal(4597762057148427)
                    },
                    {
                        "hash": "energy",
                        "amount": new Decimal(349785693872465987263498757684320873645048793578623487567834)
                    },
                    {
                        "hash": "energy",
                        "amount": new Decimal(34554)
                    }
                ]
            }
        };
        if (useSettings().gameplay.settings.autoAcceptOfflineTime?.value) {
            OfflineProgressUI.dismiss();
        } else {
            document.getElementById("offline-progress").classList.remove("loading");
            const title = document.getElementById("offline-progress-title") as TranslatedElement;
            title.refresh("misc.offlineProgress");

            const results = document.getElementById("offline-results");
            results.classList.remove("hidden");

            for (const stage in progress) {
                const container = document.createElement("div");
                container.classList.add("stage");
                results.appendChild(container);

                for (const group in progress[stage]) {
                    const groupContainer = document.createElement("div");
                    groupContainer.classList.add("group", group);
                    container.appendChild(groupContainer);

                    for (const gain of progress[stage][group]) {
                        const currency = useCurrency(gain.hash) as Currency;
                        if (!currency) continue;
                        const element = document.createElement("div");
                        groupContainer.appendChild(element);
                        let amount = "";
                        switch (gain.hash) {
                            case "energy":
                                amount = Energy.getFormatted(gain.amount);
                                break;
                            default:
                                amount = Numbers.getFormatted(gain.amount);
                        }

                        const label = document.createElement("span");
                        label.textContent = `+${amount}`;
                        element.appendChild(label);

                        element.classList.add("gain", gain.hash);

                        const particle = document.createElement("div");
                        particle.className = `resource ${currency.className || ""}`;
                        element.prepend(particle);
                    }
                }
            }
        }
    }
}
