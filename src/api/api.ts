// api.ts
export interface WPImageSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WPEmbeddedMedia {
  source_url: string;
  media_details?: {
    sizes?: Record<string, WPImageSize>;
  };
}

export interface Work {
  id: number;
  date?: string;
  date_gmt?: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPEmbeddedMedia[];
    "wp:attachment"?: WPEmbeddedMedia[];
  };
  categories?: number[];
  tags?: number[];
  lang?: string;
  translations?: Partial<Record<string, number | string | null>>;
  polylang?: {
    lang?: string;
    translations?: Record<string, number | string | null>;
  };
}

export interface Page {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  categories?: number[];
  grid: string;
  polylang?: {
    lang?: string;
    translations?: Record<string, number>;
  };
}

const API_POSTS_BASE_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/posts";
const API_PAGES_BASE_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/pages";
const CORE_PAGE_IDS = [808, 810, 811];

const EMBED_RESOURCES = "wp:featuredmedia,wp:attachment";

/**
 * Fetch dei lavori dal WP REST API
 */
export async function fetchWorks(): Promise<Work[]> {
  const collected = new Map<number, Work>();

  try {
    let page = 1;
    let totalPages = 1;

    do {
      const url = new URL(API_POSTS_BASE_URL);
      url.searchParams.set("_embed", EMBED_RESOURCES);
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", String(page));
      url.searchParams.set("lang", "all");

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Failed to fetch posts page ${page}: ${res.statusText}`);
      }

      const data = (await res.json()) as Work[];
      data.forEach(work => {
        collected.set(work.id, work);
      });

      if (page === 1) {
        const header = res.headers.get("X-WP-TotalPages");
        const parsedTotal = header ? Number.parseInt(header, 10) : NaN;
        if (Number.isFinite(parsedTotal) && parsedTotal > 0) {
          totalPages = parsedTotal;
        }
      }

      page += 1;
    } while (page <= totalPages);

    return Array.from(collected.values());
  } catch (error) {
    console.error("Error fetching works:", error);
    return Array.from(collected.values());
  }
}

export async function fetchWorkById(workId: number): Promise<Work | null> {
  if (!Number.isFinite(workId)) return null;

  try {
    const url = new URL(`${API_POSTS_BASE_URL}/${workId}`);
    url.searchParams.set("_embed", EMBED_RESOURCES);

    const res = await fetch(url.toString());
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch work ${workId}: ${res.statusText}`);
    const data = await res.json();
    return data as Work;
  } catch (error) {
    console.error(`Error fetching work ${workId}:`, error);
    return null;
  }
}

export async function fetchPages(): Promise<Page[]> {
  try {
    const baseUrl = new URL(API_PAGES_BASE_URL);
    baseUrl.searchParams.set("include", CORE_PAGE_IDS.join(","));
    baseUrl.searchParams.set("_embed", EMBED_RESOURCES);

    const res = await fetch(baseUrl.toString());
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const corePages = (await res.json()) as Page[];

    const pagesById = new Map<number, Page>();
    corePages.forEach(page => {
      pagesById.set(page.id, page);
    });

    const translationIds = new Set<number>();
    corePages.forEach(page => {
      const translations = page.polylang?.translations;
      if (translations) {
        Object.values(translations).forEach(value => {
          const numericId = typeof value === "string" ? Number.parseInt(value, 10) : value;
          if (Number.isFinite(numericId) && typeof numericId === "number" && !pagesById.has(numericId)) {
            translationIds.add(numericId);
          }
        });
      }
    });

    const translationIdsArray = Array.from(translationIds);
    if (translationIdsArray.length === 0) {
      return Array.from(pagesById.values());
    }

    try {
      const translationPages: Page[] = [];
      const chunkSize = 50;

      for (let index = 0; index < translationIdsArray.length; index += chunkSize) {
        const chunk = translationIdsArray.slice(index, index + chunkSize);
        const translationUrl = new URL(API_PAGES_BASE_URL);
        translationUrl.searchParams.set("include", chunk.join(","));
        translationUrl.searchParams.set("_embed", EMBED_RESOURCES);

        const translationRes = await fetch(translationUrl.toString());
        if (!translationRes.ok) {
          throw new Error(`Failed to fetch translations chunk: ${translationRes.statusText}`);
        }

        const chunkPages = (await translationRes.json()) as Page[];
        translationPages.push(...chunkPages);
      }

      translationPages.forEach(page => {
        pagesById.set(page.id, page);
      });
    } catch (error) {
      console.error("Error fetching page translations:", error);
      return Array.from(pagesById.values());
    }

    return Array.from(pagesById.values());
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
}
