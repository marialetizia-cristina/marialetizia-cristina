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
const WORDPRESS_REST_BASE_URL = (
  import.meta.env.VITE_WORDPRESS_REST_URL ?? "https://marialetizia.netsons.org/wp-json"
).replace(/\/$/, "");

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

export type ProductFlow = "gift_request" | "variable_quote" | "fixed_purchase";
export interface ProductTerm { id: number; name: string; slug: string; }

export interface CatalogProduct {
  id: number;
  name: string;
  description: string;
  short_description: string;
  flow: ProductFlow | "";
  price: string | null;
  price_html: string;
  indicative_price_range: string;
  physical: boolean;
  purchasable: boolean;
  in_stock: boolean;
  image: { src: string; alt: string } | null;
  categories: ProductTerm[];
  tags: ProductTerm[];
}

export interface QuoteRequestPayload {
  flow: "gift_request" | "variable_quote";
  name: string;
  email: string;
  phone?: string;
  description: string;
  privacy_accepted: boolean;
  fulfillment?: "digital" | "physical";
  product_id?: number;
  delivery?: {
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
  website?: string;
  attachment_tokens?: string[];
}

export interface QuoteRequestResponse {
  success: true;
  reference: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${WORDPRESS_REST_BASE_URL}${path}`, init);
  const data = await response.json().catch(() => null) as ({ message?: string; data?: { fields?: Record<string, string> } } | null);
  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Il servizio non è al momento disponibile.",
      response.status,
      data?.data?.fields,
    );
  }
  return data as T;
}

export function fetchProducts(): Promise<CatalogProduct[]> {
  return requestJson<CatalogProduct[]>("/portfolio-letizia/v1/products");
}

export function fetchProduct(productId: number): Promise<CatalogProduct> {
  return requestJson<CatalogProduct>(`/portfolio-letizia/v1/products/${productId}`);
}

export function submitQuoteRequest(payload: QuoteRequestPayload): Promise<QuoteRequestResponse> {
  return requestJson<QuoteRequestResponse>("/portfolio-letizia/v1/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export interface AttachmentConfig { enabled: boolean; max_bytes: number; accepted_mime_types: string[]; max_files: number; }
export interface UploadedAttachment { token: string; name: string; }

export function fetchAttachmentConfig(): Promise<AttachmentConfig> {
  return requestJson<AttachmentConfig>("/portfolio-letizia/v1/attachments/config");
}

export async function uploadAttachment(file: File): Promise<UploadedAttachment> {
  const body = new FormData();
  body.append("file", file);
  return requestJson<UploadedAttachment>("/portfolio-letizia/v1/attachments", { method: "POST", body });
}

export async function uploadAttachments(files: FileList | null, maxFiles = 0): Promise<string[]> {
  if (!files) return [];
  if (maxFiles > 0 && files.length > maxFiles) throw new ApiError(`Puoi caricare al massimo ${maxFiles} file.`, 422);
  const uploaded = await Promise.all(Array.from(files).map(uploadAttachment));
  return uploaded.map((item) => item.token);
}
