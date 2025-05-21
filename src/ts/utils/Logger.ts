import { Settings } from "./Settings";

export class Logger {
    public static log(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().debug.settings.logging.value) console.log(`[${context}]`, message, ...args);
        
    }

    public static error(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().debug.settings.logging.value) console.error(`[${context}]`, message, ...args);
    }

    public static warning(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().debug.settings.logging.value) console.warn(`[${context}]`, message, ...args);
    }

    public static debug(context: string, message: string, ...args: any[]) {
        if (Settings.get() && Settings.get().debug.settings.logging.value && Settings.get().debug.settings.verbose.value) console.debug(`[${context}]`, message, ...args);
    }
}
