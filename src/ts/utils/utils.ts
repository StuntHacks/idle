// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Utils {
    export const hexToRGB = (hex: string, alpha?: number) => {
        let noHash = hex.replace("#", "");
        let r = parseInt(noHash.slice(0, 2), 16),
            g = parseInt(noHash.slice(2, 4), 16),
            b = parseInt(noHash.slice(4, 6), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const callFunctionByName = (name: string, context: any, ...args: any[]) => {
        const namespaces = name.split(".");
        const func = namespaces.pop();
        for (let i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    }

    export const getTimeString = (timestamp: number): string => {
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
}
