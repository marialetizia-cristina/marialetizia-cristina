const DEFAULT_WP_API_ROOT = "https://marialetizia.netsons.org/wp-json";

type NullableString = string | null | undefined;

const DEFAULT_RELS: Array<{ rel: string; sizes?: string }> = [
  { rel: "icon", sizes: "any" },
  { rel: "apple-touch-icon" },
];

const META_SELECTORS: Array<{ selector: string; attr: string }> = [
  { selector: 'meta[property="og:image"]', attr: "content" },
  { selector: 'meta[name="twitter:image"]', attr: "content" },
];

interface WordPressRootResponse {
  site_icon_url?: NullableString;
}

function updateLinkElement(rel: string, href: string, sizes?: string) {
  const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (existing) {
    existing.href = href;
    if (sizes) {
      existing.setAttribute("sizes", sizes);
    }
    return;
  }

  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (sizes) {
    link.setAttribute("sizes", sizes);
  }
  document.head.appendChild(link);
}

function updateStructuredData(iconUrl: string) {
  const ldJsonScripts = document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]');

  ldJsonScripts.forEach(script => {
    const content = script.textContent;
    if (!content) return;

    try {
      const parsed = JSON.parse(content);
      const payload = Array.isArray(parsed) ? parsed : [parsed];
      let didUpdate = false;

      payload.forEach(entry => {
        if (entry && typeof entry === "object") {
          if (entry.image && typeof entry.image === "string") {
            entry.image = iconUrl;
            didUpdate = true;
          }
        }
      });

      if (didUpdate) {
        const next = Array.isArray(parsed) ? payload : payload[0];
        script.textContent = JSON.stringify(next, null, 2);
      }
    } catch (error) {
      console.warn("Unable to update structured data icon", error);
    }
  });
}

function updateMetaTags(iconUrl: string) {
  META_SELECTORS.forEach(({ selector, attr }) => {
    const meta = document.head.querySelector<HTMLMetaElement>(selector);
    if (meta) {
      meta.setAttribute(attr, iconUrl);
    }
  });
}

export async function syncSiteIcons(apiRoot?: string): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const envRoot = typeof import.meta !== "undefined" ? import.meta.env?.VITE_WP_API_ROOT : undefined;
    const targetRoot = apiRoot ?? envRoot ?? DEFAULT_WP_API_ROOT;

    const response = await fetch(targetRoot, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch WordPress root: ${response.status}`);
    }

    const data = (await response.json()) as WordPressRootResponse;
    const iconUrl = data?.site_icon_url;

    if (!iconUrl || typeof iconUrl !== "string") {
      return;
    }

    DEFAULT_RELS.forEach(({ rel, sizes }) => {
      updateLinkElement(rel, iconUrl, sizes);
    });

    updateMetaTags(iconUrl);
    updateStructuredData(iconUrl);
  } catch (error) {
    console.warn("Unable to sync site icons", error);
  }
}
