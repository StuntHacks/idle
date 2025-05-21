export namespace Utils {
    export function getNestedProperty(obj: any, path: string) {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
}
