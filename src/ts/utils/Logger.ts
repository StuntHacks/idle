/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSettings } from "./SettingsHandler";

type LogLevel = "log" | "error" | "warning" | "debug";
interface LogEntry {
    level: LogLevel;
    context: string;
    message: string;
    args: any[];
    timestamp: Date;
}

export class Logger {
    private static history: LogEntry[] = [];

    private static getLabel(context: string): string {
        return `\x1b[100m\x1b[37m ${context} \x1b[0m`;
    }

    private static record(level: LogLevel, context: string, message: string, args: any[]) {
        const snapshot = args.map(a => {
            try { return typeof a === "object" && a !== null ? JSON.parse(JSON.stringify(a)) : a; }
            catch { return a; }
        });
        this.history.push({ level, context, message, args: snapshot, timestamp: new Date() });
    }

    public static getHistory(): string {
        return this.history
            .map(({ level, context, message, args, timestamp }) => {
                const time = timestamp.toISOString();
                const extra = args.length > 0
                    ? " " + args.map(a => {
                        try { return typeof a === "object" ? JSON.stringify(a) : String(a); }
                        catch { return "[unserializable]"; }
                    }).join(" ")
                    : "";
                return `[${time}] [${level.toUpperCase()}] [${context}] ${message}${extra}`;
            })
            .join("\n");
    }

    public static clearHistory() {
        this.history = [];
    }

    public static log(context: string, message: string, ...args: any[]) {
        this.record("log", context, message, args);
        if (useSettings().debug.settings.logging.value)
            console.log(this.getLabel(context), message, ...args);
    }

    public static error(context: string, message: string, ...args: any[]) {
        this.record("error", context, message, args);
        if (useSettings().debug.settings.logging.value)
            console.error(this.getLabel(context), message, ...args);
    }

    public static warning(context: string, message: string, ...args: any[]) {
        this.record("warning", context, message, args);
        if (useSettings().debug.settings.logging.value)
            console.warn(this.getLabel(context), message, ...args);
    }

    public static debug(context: string, message: string, ...args: any[]) {
        this.record("debug", context, message, args);
        if (useSettings().debug.settings.logging.value && useSettings().debug.settings.verbose.value)
            console.debug(this.getLabel("Debug"), this.getLabel(context), message, ...args);
    }
}
