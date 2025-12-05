
// api.ts
export interface Work {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
    "wp:attachment"?: { source_url: string }[];
  };
  categories?: number[];
  tags?: number[];
  lang?: string;
  translations?: Partial<Record<string, number | string | null>>;
}

export interface Page {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  categories?: number[];
  grid: string;
}

const API_POSTS_BASE_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/posts";
const API_PAGES_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/pages?include=808,810,811&_embed";

const EMBED_RESOURCES = "wp:featuredmedia,wp:attachment";

/**
 * Fetch dei lavori dal WP REST API
 */
export async function fetchWorks(): Promise<Work[]> {
  try {
    const url = new URL(API_POSTS_BASE_URL);
    url.searchParams.set("_embed", EMBED_RESOURCES);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const data = await res.json();
    return data as Work[];
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
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

export async function fetchWorksByTagAndCategory(tagId: number, categoryId: number): Promise<Work[]> {
  try {
    const url = new URL(API_POSTS_BASE_URL);
    url.searchParams.set("_embed", EMBED_RESOURCES);
    url.searchParams.set("tags", String(tagId));
    url.searchParams.set("categories", String(categoryId));
    url.searchParams.set("per_page", "100");

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const data = await res.json();
    return data as Work[];
  } catch (error) {
    console.error("Error fetching works by tag and category:", error);
    return [];
  }
}

export async function fetchPages(): Promise<Page[]> {
  try {
    const res = await fetch(API_PAGES_URL);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const data = await res.json();
    return data as Page[];
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
}
