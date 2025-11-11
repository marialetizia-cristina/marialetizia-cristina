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

const API_URL = "https://marialetizia.netsons.org/wp-json/wp/v2/posts?_embed";

/**
 * Fetch dei lavori dal WP REST API
 */
export async function fetchWorks(): Promise<Work[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const data = await res.json();
    return data as Work[];
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
}
