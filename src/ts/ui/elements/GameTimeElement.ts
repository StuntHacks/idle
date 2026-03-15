import { SaveHandler } from "SaveHandler/SaveHandler";

export class GameTimeElement extends HTMLElement {
    constructor() {
        super();
    }

    private getTimeString(timestamp: number): string {
        const secondsInYear = 365 * 24 * 60 * 60;
        const secondsInDay = 24 * 60 * 60;
        
        let totalSeconds = Math.floor(timestamp / 1000);
        const years = Math.floor(totalSeconds / secondsInYear);
        totalSeconds %= secondsInYear;
        const days = Math.floor(totalSeconds / secondsInDay);
        totalSeconds %= secondsInDay;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => String(n).padStart(2, "0");
        const parts = [];
        if (years) parts.push(`${years} Year${years !== 1 ? "s" : ""}`);
        if (days || years) parts.push(`${days} Day${days !== 1 ? "s" : ""}`);
        parts.push(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

        return parts.join(" ");
    }

    connectedCallback() {
        const self = this;
        function update() {
            self.textContent = self.getTimeString(Date.now() - SaveHandler.getData().startTime);
            window.requestAnimationFrame(update);
        }

        window.requestAnimationFrame(update);
    }
}
