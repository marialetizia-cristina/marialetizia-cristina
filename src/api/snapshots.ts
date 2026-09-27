type SnapshotFile = "works.json" | "featured-works.json" | "pages.json" | "products.json";
const pending = new Map<SnapshotFile, Promise<unknown[]>>();

/** Deduplica lista/dettaglio e riutilizza lo snapshot durante la visita. */
export function readSnapshot<T>(file: SnapshotFile): Promise<T[]> {
  let request = pending.get(file);
  if (!request) {
    request = (async () => {
      const response = await fetch(`${import.meta.env.BASE_URL}data/wordpress/${file}`, {
        headers: { Accept: "application/json" },
        cache: "no-cache",
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error("I contenuti non sono al momento disponibili.");
      const data: unknown = await response.json();
      // Intercetta anche fallback SPA/risposte di errore serviti con HTTP 200.
      if (!Array.isArray(data) || data.some(item => !item || !Number.isInteger(item.id) || item.id <= 0)) {
        throw new Error("I contenuti non sono al momento disponibili.");
      }
      return data;
    })().catch((error: unknown) => {
      pending.delete(file);
      throw error;
    });
    pending.set(file, request);
  }
  return request as Promise<T[]>;
}
