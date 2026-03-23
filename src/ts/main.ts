import { PopoverManager } from "ui/PopoverManager";
import { Currencies } from "./game_logic/currencies/Currencies";
import { Game } from "./game_logic/Game";
import { CustomElements } from "ui/CustomElements";
import { PopoverElement } from "ui/elements/PopoverElement";

export const main = async () => {
    const game = new Game();

    // initialize
    Currencies.initialize("quantum-resource-gain-container"); // todo: fix selector
    CustomElements.initialize();

    document.getElementById("magic-button").addEventListener("click", () => {
        game.timeskip(3 * 3600);
    });

    game.start();
    PopoverManager.add(new PopoverElement("Test title", "Test content<h1>wow</h1>"))
    PopoverManager.add(new PopoverElement("Test title 2", "Test content", true, [
        {
            label: "It works",
            callback: () => console.log("Button 1 clicked")
        },
        {
            label: "It works 2",
            callback: () => console.log("Button 2 clicked"),
            type: "secondary"
        }
    ]));
    PopoverManager.add(new PopoverElement("Test title", "Test content<h1>wow</h1>"))
    // document.addEventListener("contextmenu", (e) => e.preventDefault());
}
