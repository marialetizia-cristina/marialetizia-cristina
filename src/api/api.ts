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

const API_POSTS_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/posts?_embed";
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