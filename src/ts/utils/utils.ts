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
}
