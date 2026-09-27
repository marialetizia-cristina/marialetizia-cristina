import { readSnapshot } from "./snapshots";

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

export interface WPEmbeddedTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy?: string;
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
    "wp:term"?: WPEmbeddedTerm[][];
  };
  categories?: number[];
  tags?: number[];
  lang?: string;
  translations?: Partial<Record<string, number | string | null>>;
  polylang?: {
    lang?: string;
    translations?: Record<string, number | string | null>;
  };
  /** Canonical REST field exposed by the WordPress project editor. */
  linked_product_id?: number | string | null;
  /** ACF fallback while the backend field is being migrated. */
  acf?: {
    linked_product_id?: number | string | null;
  };
  meta?: {
    linked_product_id?: number | string | null;
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
  lang?: string;
  translations?: Record<string, number>;
  polylang?: {
    lang?: string;
    translations?: Record<string, number>;
  };
}

const WORDPRESS_REST_BASE_URL = (
  import.meta.env.VITE_WORDPRESS_REST_URL ?? "https://marialetizia.netsons.org/wp-json"
).replace(/\/$/, "");

/** Catalogo statico dello stesso deployment, senza fallback alle API WordPress. */
export function fetchWorks(): Promise<Work[]> {
  return readSnapshot<Work>("works.json");
}

export function fetchFeaturedWorks(): Promise<Work[]> {
  return readSnapshot<Work>("featured-works.json");
}

export async function fetchWorkById(workId: number): Promise<Work | null> {
  if (!Number.isInteger(workId) || workId <= 0) return null;
  return (await fetchWorks()).find(work => work.id === workId) ?? null;
}

export function fetchPages(): Promise<Page[]> {
  return readSnapshot<Page>("pages.json");
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

export function getLinkedProductId(work: Work): number | null {
  const rawId = work.linked_product_id ?? work.acf?.linked_product_id ?? work.meta?.linked_product_id;
  if (rawId === null || rawId === undefined || rawId === "") return null;

  const productId = typeof rawId === "number" ? rawId : Number.parseInt(rawId, 10);
  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

export interface QuoteRequestPayload {
  flow: "gift_request" | "variable_quote";
  name: string;
  email: string;
  phone?: string;
  description: string;
  desired_delivery_date: string;
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
  return readSnapshot<CatalogProduct>("products.json");
}

export async function fetchProduct(productId: number): Promise<CatalogProduct> {
  const product = Number.isInteger(productId) && productId > 0
    ? (await fetchProducts()).find(item => item.id === productId)
    : undefined;
  if (!product) throw new ApiError("Prodotto non trovato.", 404);
  return product;
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
