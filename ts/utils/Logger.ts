import { Settings } from "./Settings";

export class Logger {
    public static log(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().logging.enabled) console.log(`[${context}]`, message, ...args);
        
    }

    public static error(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().logging.enabled) console.error(`[${context}]`, message, ...args);
    }

    public static warning(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().logging.enabled) console.warn(`[${context}]`, message, ...args);
    }

    public static debug(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().logging.enabled && Settings.get().logging.verbose) console.debug(`[${context}]`, message, ...args);
    }
}
