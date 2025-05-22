
import { TranslatedElement, translations } from "./i18n/i18n";
import { SaveHandler } from "./SaveHandler/SaveHandler";
import { Wave } from "./ui/Wave";
import { Settings } from "./utils/Settings";
import { Utils } from "./utils/utils";

export const main = () => {
    if (!SaveHandler.loadData()) {
        SaveHandler.initialize();
    }

    let data = SaveHandler.getData();
    Settings.set(data.settings);

    customElements.define("translated-string", TranslatedElement);

    let mainContainer = document.getElementById("main");
    let fieldsTabContainer = document.getElementById("tab-fields");
    let waveOffset = ((fieldsTabContainer.clientHeight / 6) / 2);

    const electronWave = new Wave(document.getElementById("electron-field-canvas") as HTMLCanvasElement, fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#ffffaa",
        colorEnd: "#ffffDD",
        colorGlow: "#ffff00",
        colorHover: "#DDAA00",
        pointCount: 10,
        offset: waveOffset * 1 + 200,
    });

    const quarkWaveRed = new Wave(document.getElementById("quark-field-red-canvas") as HTMLCanvasElement, fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#ff0000",
        colorEnd: "#ff00ff",
        colorGlow: "#ff00ff",
        colorHover: "#DDAA00",
        pointCount: 10,
        offset: waveOffset * 2 + 200,
    });

    const quarkWaveGreen = new Wave(document.getElementById("quark-field-green-canvas") as HTMLCanvasElement, fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#00ff00",
        colorEnd: "#00ffff",
        colorGlow: "#00ff00",
        colorHover: "#DDAA00",
        pointCount: 10,
        offset: waveOffset * 3 + 200,
    });

    const quarkWaveBlue = new Wave(document.getElementById("quark-field-blue-canvas") as HTMLCanvasElement, fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#0000ff",
        colorEnd: "#00ffff",
        colorGlow: "#00ffff",
        colorHover: "#DDAA00",
        pointCount: 10,
        offset: waveOffset * 4 + 200,
    });

    const electroweakWave = new Wave(document.getElementById("electroweak-field-canvas") as HTMLCanvasElement, fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.02,
        lineWidth: 3,
        colorStart: "#AAAAAA",
        colorEnd: "#DDDDDD",
        colorGlow: "#DDDDDD",
        colorHover: "#DDAA00",
        pointCount: 10,
        offset: waveOffset * 5 + 200,
    });

    const higgsWave = new Wave(document.getElementById("higgs-field-canvas") as HTMLCanvasElement, fieldsTabContainer, {
        amplitude: 10,
        frequency: 1,
        speed: 0.042,
        lineWidth: 3,
        colorStart: "#998800",
        colorEnd: "#bb9900",
        colorGlow: "#DDAA00",
        colorHover: "#DDAA00",
        pointCount: 10,
        offset: waveOffset * 6 + 200,
    });

    document.addEventListener("click", () => {
        higgsWave.bounce((bounced: boolean) => {
            console.log("Bounce finished!", bounced);
        })
    });

    // ready
    document.getElementsByTagName("body")[0].classList.remove("loading");
}
