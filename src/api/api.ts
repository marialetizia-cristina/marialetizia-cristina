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
}

export interface Page {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  categories?: number[];
  grid: string;
}

const API_POSTS_BASE_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/posts";
const API_POSTS_URL = `${API_POSTS_BASE_URL}?_embed=wp:featuredmedia,wp:attachment`;
const API_PAGES_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/pages?include=808,810,811&_embed";

/**
 * Fetch dei lavori dal WP REST API
 */
export async function fetchWorks(): Promise<Work[]> {
  try {
    const res = await fetch(API_POSTS_URL);
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
    const res = await fetch(`${API_POSTS_BASE_URL}/${workId}?_embed=wp:featuredmedia,wp:attachment`);
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
    const res = await fetch(API_PAGES_URL);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const data = await res.json();
    return data as Page[];
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
}