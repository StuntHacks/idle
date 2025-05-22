export namespace Utils {
    export const getNestedProperty = (obj: any, path: string) => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }

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
}
