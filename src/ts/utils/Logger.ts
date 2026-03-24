/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSettings } from "./SettingsHandler";

export class Logger {
    private static getLabel(context: string): string {
        return `\x1b[100m\x1b[37m ${context} \x1b[0m`;
    }

    public static log(context: string, message: string, ...args: any[]) {
        if (useSettings().debug.settings.logging.value)
            console.log(this.getLabel(context), message, ...args);
    }

    public static error(context: string, message: string, ...args: any[]) {
        if (useSettings().debug.settings.logging.value)
            console.error(this.getLabel(context), message, ...args);
    }

    public static warning(context: string, message: string, ...args: any[]) {
        if (useSettings().debug.settings.logging.value)
            console.warn(this.getLabel(context), message, ...args);
    }

    public static debug(context: string, message: string, ...args: any[]) {
        if (useSettings().debug.settings.logging.value && useSettings().debug.settings.verbose.value)
            console.debug(this.getLabel("Debug"), this.getLabel(context), message, ...args);
    }
}
