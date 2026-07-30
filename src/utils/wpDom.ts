export interface ParsedImage {
    src: string;
    alt: string;
    caption?: string;
}

const sanitizeClassList = (element: Element) => {
    if (!element.hasAttribute("class")) {
        return;
    }

    const classes = element.getAttribute("class") ?? "";
    const filtered = classes
        .split(/\s+/)
        .filter(token => {
            if (token.length === 0) {
                return false;
            }

            if (token.startsWith("wp-")) {
                return false;
            }

            if (token.startsWith("is-layout")) {
                return false;
            }

            if (token.startsWith("align")) {
                return false;
            }

            return true;
        });

    if (filtered.length > 0) {
        element.setAttribute("class", filtered.join(" "));
    } else {
        element.removeAttribute("class");
    }
};

export const stripWpClasses = (root: ParentNode) => {
    const selectorRoot = root as ParentNode & { querySelectorAll?: (selectors: string) => NodeListOf<Element> };

    if (selectorRoot.querySelectorAll) {
        const elements = Array.from(selectorRoot.querySelectorAll("[class]"));
        elements.forEach(sanitizeClassList);
    }

    if (root instanceof Element) {
        sanitizeClassList(root);
    }
};

export const replaceLineBreaksWithSpaces = (root: ParentNode) => {
    root.querySelectorAll("br").forEach(br => {
        br.replaceWith(document.createTextNode(" "));
    });
};

export const toParsedImage = (img: HTMLImageElement | null): ParsedImage | null => {
    if (!img) {
        return null;
    }

    const src = img.getAttribute("src") ?? img.src;
    if (!src) {
        return null;
    }

    const figure = img.closest("figure");
    const captionElement = figure?.querySelector("figcaption");

    return {
        src,
        alt: img.getAttribute("alt") ?? "",
        caption: captionElement ? captionElement.innerHTML.trim() : undefined,
    };
};
