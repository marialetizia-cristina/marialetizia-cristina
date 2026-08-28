import { useEffect } from "react";

const SITE_NAME = "Marialetizia Cristina";
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://marialetiziacristina.vercel.app").replace(/\/$/, "");

type PageAlternates = {
  it: string;
  en: string;
  default: string;
};

export function usePageMeta(
  title: string,
  description: string,
  path: string,
  noIndex = false,
  alternates?: PageAlternates,
): void {
  useEffect(() => {
    document.title = `${title} · ${SITE_NAME}`;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (descriptionMeta) descriptionMeta.content = description;
    if (robotsMeta) robotsMeta.content = noIndex ? "noindex, nofollow" : "index, follow";
    if (canonical) canonical.href = `${SITE_URL}${path}`;

    if (alternates) {
      const alternateValues = { it: alternates.it, en: alternates.en, "x-default": alternates.default };
      Object.entries(alternateValues).forEach(([language, alternatePath]) => {
        let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${language}"]`);
        if (!link) {
          link = document.createElement("link");
          link.rel = "alternate";
          link.hreflang = language;
          document.head.appendChild(link);
        }
        link.href = `${SITE_URL}${alternatePath}`;
      });
    }
    return () => {
      if (robotsMeta) robotsMeta.content = "index, follow";
    };
  }, [alternates, description, noIndex, path, title]);
}
