// api.ts
export interface WPImageSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WPEmbeddedMedia {
  source_url: string;
  alt_text?: string;
  title?: {
    rendered: string;
  };
  media_details?: {
    width?: number;
    height?: number;
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
  const collected = new Map<number, Page>();

  try {
    let page = 1;
    let totalPages = 1;

    do {
      const url = new URL(API_PAGES_BASE_URL);
      url.searchParams.set("_embed", EMBED_RESOURCES);
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", String(page));
      url.searchParams.set("lang", "all");

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Failed to fetch pages page ${page}: ${res.statusText}`);
      }

      const data = (await res.json()) as Page[];
      data.forEach(pageData => {
        collected.set(pageData.id, pageData);
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
    console.error("Error fetching pages:", error);
    return Array.from(collected.values());
  }
}
