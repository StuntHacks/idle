// lookups for elements that are part of the static markup; a missing one is a bug, so fail loudly with a useful message
export const requireElement = <T extends HTMLElement = HTMLElement>(id: string): T => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing element #${id}`);
    return element as T;
};

export const requireChild = <T extends Element = HTMLElement>(root: ParentNode, selector: string): T => {
    const element = root.querySelector(selector);
    if (!element) throw new Error(`Missing element "${selector}"`);
    return element as T;
};

export const requireAttribute = (element: Element, name: string): string => {
    const value = element.getAttribute(name);
    if (value === null) throw new Error(`Missing attribute "${name}" on <${element.tagName.toLowerCase()}>`);
    return value;
};
