import { useMemo } from "react";
import type { ParsedImage } from "../utils/wpDom";
import { stripWpClasses, toParsedImage } from "../utils/wpDom";

interface CaseStudyBlockText {
    kind: "text";
    html: string;
}
 

interface CaseStudyBlockGallery {
    kind: "gallery";
    images: ParsedImage[];
}

type CaseStudyBlock = CaseStudyBlockText | CaseStudyBlockGallery;

const isParagraphOnly = (html: string): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const elements = Array.from(template.content.children);

    if (elements.length === 0) {
        return false;
    }

    return elements.every(element => element.tagName.toLowerCase() === "p");
};

const isRenderableNode = (node: Node): boolean => {
    if (node.nodeType === Node.TEXT_NODE) {
        return Boolean(node.textContent?.trim());
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
        return true;
    }
    return false;
};

const parseCaseStudyBlocks = (html: string): CaseStudyBlock[] => {
    if (!html) {
        return [];
    }

    if (typeof window === "undefined") {
        return [{ kind: "text", html }];
    }

    const template = document.createElement("template");
    template.innerHTML = html;

    const blocks: CaseStudyBlock[] = [];
    let textBuffer: string[] = [];

    const flushText = () => {
        if (textBuffer.length === 0) {
            return;
        }
        const combined = textBuffer.join("").trim();
        if (combined.length > 0) {
            blocks.push({ kind: "text", html: combined });
        }
        textBuffer = [];
    };

    const pushGallery = (images: ParsedImage[]) => {
        const distinct = images.filter((image, index, arr) => {
            return image.src && arr.findIndex(candidate => candidate.src === image.src) === index;
        });

        if (distinct.length > 0) {
            flushText();
            blocks.push({ kind: "gallery", images: distinct });
        }
    };

    const handleNode = (node: Node): void => {
        if (!isRenderableNode(node)) {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            const content = node.textContent?.trim();
            if (content) {
                textBuffer.push(`<p>${content}</p>`);
            }
            return;
        }

        if (!(node instanceof HTMLElement)) {
            return;
        }

        handleElement(node);
    };

    const gatherImages = (element: HTMLElement): ParsedImage[] => {
        const sources = Array.from(element.querySelectorAll("img"));
        return sources.map(img => toParsedImage(img)).filter((img): img is ParsedImage => Boolean(img));
    };

    const handleElement = (element: HTMLElement): void => {
        if (element.matches("script, style")) {
            return;
        }

        if (element.matches(".wp-block-gallery")) {
            pushGallery(gatherImages(element));
            return;
        }

        if (element.matches("figure") && element.querySelector("img")) {
            pushGallery(gatherImages(element));
            return;
        }

        if (element.matches(".wp-block-group, .wp-block-columns, .wp-block-column, .wp-block-media-text")) {
            Array.from(element.childNodes).forEach(handleNode);
            return;
        }

        if (element.querySelector(".wp-block-gallery")) {
            Array.from(element.childNodes).forEach(handleNode);
            return;
        }

        if (element.querySelector("figure img")) {
            Array.from(element.childNodes).forEach(handleNode);
            return;
        }

        const clone = element.cloneNode(true) as HTMLElement;
        stripWpClasses(clone);
        const outer = clone.outerHTML.trim();
        if (outer.length > 0) {
            textBuffer.push(outer);
        }
    };

    Array.from(template.content.childNodes).forEach(handleNode);
    flushText();

    return blocks;
};

interface CaseStudyContentProps {
    html: string;
    className?: string;
}

const CaseStudyContent = ({ html, className = "" }: CaseStudyContentProps) => {
    const blocks = useMemo(() => {
        if (typeof window === "undefined") {
            return null;
        }
        return parseCaseStudyBlocks(html);
    }, [html]);

    if (!html) {
        return null;
    }

    if (!blocks) {
        return (
            <article
                className={`single__content single__content--blocks ${className}`.trim()}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    if (blocks.length === 0) {
        return (
            <article
                className={`single__content single__content--blocks ${className}`.trim()}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    return (
        <div className={`case-study ${className}`.trim()}>
            {blocks.map((block, index) => {
                if (block.kind === "text") {
                    const isLastBlock = index === blocks.length - 1;
                    const onlyParagraphs = isParagraphOnly(block.html);
                    const textClassName = [
                        "case-study__text",
                        isLastBlock && onlyParagraphs ? "case-study__text--no-bottom" : null,
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <div
                            key={`text-${index}`}
                            className={textClassName}
                            dangerouslySetInnerHTML={{ __html: block.html }}
                        />
                    );
                }

                return (
                    <div key={`gallery-${index}`} className="case-study__gallery">
                        {block.images.map((image, imageIndex) => (
                            <figure key={`${image.src}-${imageIndex}`}>
                                <img src={image.src} alt={image.alt || ""} loading="lazy" />
                                {image.caption ? (
                                    <figcaption dangerouslySetInnerHTML={{ __html: image.caption }} />
                                ) : null}
                            </figure>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default CaseStudyContent;
