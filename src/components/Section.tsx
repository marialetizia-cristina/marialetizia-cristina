import { useMemo } from "react";
import type { Page } from "../api/api";
import "../style/Section.css";
import { stripWpClasses, toParsedImage, type ParsedImage } from "../utils/wpDom";

interface SectionProps {
  page?: Page;
  id: string;
}

interface AboutContent {
  image: ParsedImage | null;
  textHtml: string;
}

interface ServiceCard {
  icon: ParsedImage | null;
  progress: ParsedImage | null;
  textHtml: string;
}

interface ServicesContent {
  introHtml: string;
  cards: ServiceCard[];
}

interface ContactLink {
  href: string;
  label: string;
  icon: ParsedImage | null;
  iconSvg?: string | null;
  target?: string | null;
  rel?: string | null;
}

interface ContactContent {
  introImage: ParsedImage | null;
  textHtml: string;
  links: ContactLink[];
  bannerImage: ParsedImage | null;
}

interface GenericContent {
  html: string;
}

type SectionData =
  | { kind: "about"; content: AboutContent }
  | { kind: "services"; content: ServicesContent }
  | { kind: "contact"; content: ContactContent }
  | { kind: "generic"; content: GenericContent }
  | { kind: "empty" };

const parseAboutContent = (html: string): AboutContent => {
  if (!html) {
    return { image: null, textHtml: "" };
  }

  if (typeof window === "undefined") {
    return { image: null, textHtml: html };
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  const figure = template.content.querySelector("figure");
  let image: ParsedImage | null = null;

  if (figure) {
    const parsed = toParsedImage(figure.querySelector("img"));
    if (parsed) {
      image = parsed;
    }
    figure.remove();
  }

  stripWpClasses(template.content);

  return {
    image,
    textHtml: template.innerHTML.trim(),
  };
};

const parseServicesContent = (html: string): ServicesContent => {
  if (!html) {
    return { introHtml: "", cards: [] };
  }

  if (typeof window === "undefined") {
    return { introHtml: html, cards: [] };
  }

  const container = document.createElement("div");
  container.innerHTML = html;

  const allowedTags = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "BLOCKQUOTE"]);
  const nodes: Element[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);

  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    if (element.tagName === "FIGURE" || allowedTags.has(element.tagName)) {
      nodes.push(element);
    }
  }

  const cards: ServiceCard[] = [];
  let currentIcon: ParsedImage | null = null;
  let currentProgress: ParsedImage | null = null;
  let currentFragments: string[] = [];

  const commitCard = (nextIcon: ParsedImage | null = null) => {
    if (currentIcon || currentProgress || currentFragments.length > 0) {
      cards.push({
        icon: currentIcon,
        progress: currentProgress,
        textHtml: currentFragments.join("").trim(),
      });
    }

    currentIcon = nextIcon;
    currentProgress = null;
    currentFragments = [];
  };

  nodes.forEach(node => {
    if (!container.contains(node)) {
      return;
    }

    if (node.tagName === "FIGURE") {
      const parsedImage = toParsedImage(node.querySelector("img"));
      node.remove();

      if (!parsedImage) {
        return;
      }

      stripWpClasses(node);

      if (!currentIcon) {
        currentIcon = parsedImage;
        return;
      }

      if (!currentProgress) {
        currentProgress = parsedImage;
        return;
      }

      commitCard(parsedImage);
      return;
    }

    stripWpClasses(node);

    const snippet = node.outerHTML;
    node.remove();

    currentFragments.push(snippet);
  });

  stripWpClasses(container);
  commitCard();

  const parsedCards: ServiceCard[] = cards
    .filter(card => card.icon || card.progress || card.textHtml.length > 0)
    .slice(0, 6);

  return {
    introHtml: container.innerHTML.trim(),
    cards: parsedCards,
  };
};

const parseContactContent = (html: string): ContactContent => {
  if (!html) {
    return { introImage: null, textHtml: "", links: [], bannerImage: null };
  }

  if (typeof window === "undefined") {
    return { introImage: null, textHtml: html, links: [], bannerImage: null };
  }

  const container = document.createElement("div");
  container.innerHTML = html;

  const anchorElements = Array.from(container.querySelectorAll<HTMLAnchorElement>("a[href]"));
  const links: ContactLink[] = [];

  anchorElements.slice(0, 5).forEach(anchor => {
    const clone = anchor.cloneNode(true) as HTMLElement;

    const iconImage = clone.querySelector<HTMLImageElement>("img");
    const icon = toParsedImage(iconImage);

    if (iconImage) {
      const figure = iconImage.closest("figure");
      if (figure) {
        figure.remove();
      } else {
        iconImage.remove();
      }
    }

    let iconSvg: string | null = null;
    if (!icon) {
      const iconSvgElement = clone.querySelector("svg");
      if (iconSvgElement) {
        iconSvg = iconSvgElement.outerHTML;
        iconSvgElement.remove();
      }
    }

    const fallbackHref = anchor.getAttribute("href") ?? "";
    const labelSource = (clone.textContent ?? "").trim();
    const label = labelSource || fallbackHref;
    const href = fallbackHref || "#";
    const target = anchor.getAttribute("target");
    const rel = anchor.getAttribute("rel");

    anchor.remove();

    links.push({ href, label, icon, iconSvg, target, rel });
  });

  stripWpClasses(container);

  const remainingImages = Array.from(container.querySelectorAll<HTMLImageElement>("img"));
  const firstImage = remainingImages[0] ?? null;
  const lastImage = remainingImages.length > 1 ? remainingImages[remainingImages.length - 1] : null;

  const removeImage = (img: HTMLImageElement | null): ParsedImage | null => {
    if (!img || !container.contains(img)) {
      return null;
    }

    const parsed = toParsedImage(img);
    const wrapper = img.closest("figure");
    if (wrapper) {
      wrapper.remove();
    } else {
      img.remove();
    }

    return parsed;
  };

  const introImage = removeImage(firstImage);
  const bannerImage = lastImage && lastImage !== firstImage ? removeImage(lastImage) : null;

  return {
    introImage,
    textHtml: container.innerHTML.trim(),
    links,
    bannerImage,
  };
};

const parseGenericContent = (html: string): GenericContent => {
  if (!html) {
    return { html: "" };
  }

  if (typeof window === "undefined") {
    return { html };
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  stripWpClasses(template.content);

  return { html: template.innerHTML.trim() };
};

const Section = ({ page, id }: SectionProps) => {
  const contentHtml = page?.content?.rendered ?? "";

  const parsed = useMemo<SectionData>(() => {
    if (!contentHtml) {
      return { kind: "empty" };
    }

    switch (id) {
      case "about":
        return { kind: "about", content: parseAboutContent(contentHtml) };
      case "services":
        return { kind: "services", content: parseServicesContent(contentHtml) };
      case "contact":
        return { kind: "contact", content: parseContactContent(contentHtml) };
      default:
        return { kind: "generic", content: parseGenericContent(contentHtml) };
    }
  }, [contentHtml, id]);

  if (!page || parsed.kind === "empty") {
    return null;
  }

  if (parsed.kind === "about") {
    const { image, textHtml } = parsed.content;

    if (!image && !textHtml) {
      return null;
    }

    return (
      <section className="section section--about" id={id}>
        <div className="section__inner">
          <div className="section-about">
            {image && (
              <figure className="section-about__media">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </figure>
            )}
            {textHtml && (
              <div
                className="section-about__text"
                dangerouslySetInnerHTML={{ __html: textHtml }}
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (parsed.kind === "services") {
    const { introHtml, cards } = parsed.content;

    if (!introHtml && cards.length === 0) {
      return null;
    }

    return (
      <section className="section section--services" id={id}>
        <div className="section__inner">
          {/* {introHtml && (
            <div
              className="section__intro"
              dangerouslySetInnerHTML={{ __html: introHtml }}
            />
          )} */}
          {cards.length > 0 && (
            <div className="services-grid">
              {cards.map((card, index) => (
                <article className="service-card" key={`${card.textHtml}-${index}`}>
                  {card.icon && (
                    <figure className="service-card__icon service-card__icon--primary">
                      <img src={card.icon.src} alt={card.icon.alt} loading="lazy" />
                    </figure>
                  )}
                  {card.textHtml && (
                    <div
                      className="service-card__body"
                      dangerouslySetInnerHTML={{ __html: card.textHtml }}
                    />
                  )}
                  {card.progress && (
                    <figure className="service-card__progress service-card__progress--secondary">
                      <img src={card.progress.src} alt={card.progress.alt} loading="lazy" />
                    </figure>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (parsed.kind === "contact") {
    const { introImage, textHtml, links, bannerImage } = parsed.content;

    if (!introImage && !textHtml && links.length === 0 && !bannerImage) {
      return null;
    }

    return (
      <section className="section section--contact" id={id}>
        <div className="section__inner section__inner--contact">
          <div className="contact-board">
            {introImage && (
              <figure className="contact-board__badge">
                <img src={introImage.src} alt={introImage.alt} loading="lazy" />
              </figure>
            )}
            {(textHtml || links.length > 0) && (
              <div className="contact-board__details">
                {/* {textHtml && (
                  <div
                    className="contact-board__text"
                    dangerouslySetInnerHTML={{ __html: textHtml }}
                  />
                )} */}
                {links.length > 0 && (
                  <div className="contact-links">
                    {links.map((link, index) => (
                      <div className="contact-link" key={`${link.href}-${index}`}>
                        {link.icon && (
                          <span className="contact-link__icon">
                            <img src={link.icon.src} alt={link.icon.alt} loading="lazy" />
                          </span>
                        )}
                        {!link.icon && link.iconSvg && (
                          <span
                            className="contact-link__icon"
                            dangerouslySetInnerHTML={{ __html: link.iconSvg }}
                          />
                        )}
                        <a
                          className="contact-link__anchor"
                          href={link.href}
                          target={link.target ?? undefined}
                          rel={link.rel ?? undefined}
                        >
                          {link.label}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {bannerImage && (
            <figure className="contact-banner contact-banner--absolute">
              <img src={bannerImage.src} alt={bannerImage.alt} loading="lazy" />
            </figure>
          )}
        </div>
      </section>
    );
  }

  if (parsed.kind === "generic") {
    const { html } = parsed.content;

    if (!html) {
      return null;
    }

    return (
      <section className="section section--generic" id={id}>
        <div className="section__inner">
          <div
            className="section__text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    );
  }

  return null;
};

export default Section;
