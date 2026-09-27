import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

type RecordData = Record<string, unknown> & { id: number };
type Fetcher = typeof fetch;
const DEFAULT_URL = "https://marialetizia.netsons.org/wp-json";
const EMBED = "wp:featuredmedia,wp:attachment,wp:term";

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function rendered(value: unknown): boolean {
  return object(value) && typeof value.rendered === "string";
}

function validate(value: unknown, products: boolean): asserts value is RecordData[] {
  if (!Array.isArray(value)) throw new Error("La risposta non è una lista JSON.");
  for (const item of value) {
    if (!object(item) || !Number.isSafeInteger(item.id) || Number(item.id) <= 0) {
      throw new Error("Record senza ID valido.");
    }
    if (products) {
      if (typeof item.name !== "string" || !["", "gift_request", "variable_quote", "fixed_purchase"].includes(String(item.flow))
        || typeof item.physical !== "boolean" || typeof item.purchasable !== "boolean"
        || typeof item.in_stock !== "boolean" || !(item.price === null || typeof item.price === "string")) {
        throw new Error(`Prodotto ${item.id}: formato incompatibile con il catalogo pubblico.`);
      }
    } else if (!rendered(item.title) || !rendered(item.content)
      || (item.status !== undefined && item.status !== "publish")) {
      throw new Error(`Contenuto ${item.id}: formato non valido o non pubblico.`);
    }
  }
}

function countHeader(response: Response, name: string): number | null {
  const value = response.headers.get(name);
  if (value === null) return null;
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new Error(`Header di paginazione non valido: ${name}.`);
  }
  return Number(value);
}

async function collection(base: string, path: string, fetcher: Fetcher, products = false): Promise<RecordData[]> {
  const items = new Map<number, RecordData>();
  let totalPages = 1;
  let total: number | null = null;
  for (let page = 1; page <= totalPages; page++) {
    const url = new URL(`${base}/${path}`);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    if (!products) {
      url.searchParams.set("lang", "all");
      url.searchParams.set("status", "publish");
      url.searchParams.set("context", "view");
      url.searchParams.set("_embed", EMBED);
      url.searchParams.set("orderby", "id");
      url.searchParams.set("order", "asc");
    }
    const response = await fetcher(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`${path}, pagina ${page}: HTTP ${response.status}.`);
    const data: unknown = await response.json();
    validate(data, products);
    const pagesHeader = countHeader(response, "X-WP-TotalPages");
    const totalHeader = countHeader(response, "X-WP-Total");
    // L'endpoint custom prodotti oggi restituisce una lista completa senza header.
    // Se espone paginazione WordPress, la seguiamo con gli stessi controlli.
    if ((!products || pagesHeader !== null || totalHeader !== null)
      && (pagesHeader === null || totalHeader === null)) {
      throw new Error(`${path}: header di paginazione mancanti.`);
    }
    if (page === 1) {
      totalPages = Math.max(1, pagesHeader ?? 1);
      total = totalHeader;
      if (totalPages > 10_000) throw new Error(`${path}: troppe pagine.`);
    } else if (Math.max(1, pagesHeader ?? 1) !== totalPages || totalHeader !== total) {
      throw new Error(`${path}: il catalogo è cambiato durante il download; ripetere il sync.`);
    }
    if (data.length === 0 && total !== null && total > 0) {
      throw new Error(`${path}: pagina vuota inattesa.`);
    }
    for (const item of data) {
      if (items.has(item.id)) throw new Error(`${path}: ID duplicato ${item.id}; snapshot incoerente.`);
      items.set(item.id, item);
    }
  }
  if (total !== null && items.size !== total) throw new Error(`${path}: download incompleto.`);
  return [...items.values()];
}

/** Ordine stabile delle chiavi; nessun timestamp che produca commit inutili. */
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (object(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}

export async function syncWordPress(options: {
  baseUrl?: string;
  outputDir?: string;
  fetcher?: Fetcher;
} = {}): Promise<Record<string, number>> {
  const base = new URL(options.baseUrl ?? process.env.WORDPRESS_REST_URL ?? DEFAULT_URL);
  if (!["https:", "http:"].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
    throw new Error("WORDPRESS_REST_URL deve essere una URL HTTP(S) senza credenziali, query o fragment.");
  }
  const baseUrl = base.href.replace(/\/$/, "");
  const fetcher = options.fetcher ?? fetch;
  const works = await collection(baseUrl, "wp/v2/posts", fetcher);
  const pages = await collection(baseUrl, "wp/v2/pages", fetcher);
  const products = await collection(baseUrl, "portfolio-letizia/v1/products", fetcher, true);
  // Mantiene l'ordinamento editoriale preesistente (data decrescente).
  works.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")) || b.id - a.id);
  pages.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")) || b.id - a.id);
  products.sort((a, b) => a.id - b.id);
  const snapshots: Record<string, RecordData[]> = {
    "works.json": works,
    "featured-works.json": works.filter(work => Array.isArray(work.categories)
      && work.categories.some(id => id === 14 || id === 60)),
    "pages.json": pages,
    "products.json": products,
  };

  // Nessuna scrittura finché tutte le risposte non sono state validate.
  const output = resolve(options.outputDir ?? process.env.SYNC_OUTPUT_DIR ?? "public/data/wordpress");
  await mkdir(output, { recursive: true });
  const staging = await mkdtemp(join(output, ".sync-"));
  try {
    for (const [name, data] of Object.entries(snapshots)) {
      await writeFile(join(staging, name), `${JSON.stringify(stable(data), null, 2)}\n`, "utf8");
    }
    for (const name of Object.keys(snapshots)) await rename(join(staging, name), join(output, name));
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
  return Object.fromEntries(Object.entries(snapshots).map(([name, data]) => [name, data.length]));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  syncWordPress().then(counts => {
    for (const [name, count] of Object.entries(counts)) console.log(`${name}: ${count} record`);
  }).catch((error: unknown) => {
    console.error("Sync WordPress fallito:", error instanceof Error ? error.message : "Errore sconosciuto");
    process.exitCode = 1;
  });
}
