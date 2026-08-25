import { useEffect } from "react";

const SITE_NAME = "Marialetizia Cristina";
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://marialetiziacristina.vercel.app").replace(/\/$/, "");

export function usePageMeta(title: string, description: string, path: string, noIndex = false): void {
  useEffect(() => {
    document.title = `${title} · ${SITE_NAME}`;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (descriptionMeta) descriptionMeta.content = description;
    if (robotsMeta) robotsMeta.content = noIndex ? "noindex, nofollow" : "index, follow";
    if (canonical) canonical.href = `${SITE_URL}${path}`;
    return () => {
      if (robotsMeta) robotsMeta.content = "index, follow";
    };
  }, [description, noIndex, path, title]);
}
