import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const work = { id: 1, lang: "it", translations: { en: 2 }, linked_product_id: 7 };
const translated = { ...work, id: 2, lang: "en" };
const product = { id: 7, flow: "fixed_purchase", price: "50" };
const fetchMock = vi.fn();

beforeEach(() => {
  vi.resetModules();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("catalogo JSON", () => {
  it("legge tutte le liste dal sito e riusa works/products per dettagli e traduzioni", async () => {
    const data: Record<string, unknown[]> = {
      "works.json": [work, translated], "featured-works.json": [work],
      "pages.json": [{ id: 3, slug: "about" }], "products.json": [product],
    };
    fetchMock.mockImplementation(async (url: string) => new Response(JSON.stringify(data[url.split("/").at(-1)!])));
    const api = await import("./api");
    const [works, detail, translation] = await Promise.all([
      api.fetchWorks(), api.fetchWorkById(1), api.fetchWorkById(2),
    ]);
    expect(works).toEqual([work, translated]);
    expect(detail).toEqual(work);
    expect(translation).toEqual(translated);
    expect(await api.fetchFeaturedWorks()).toEqual([work]);
    expect(await api.fetchPages()).toEqual([{ id: 3, slug: "about" }]);
    expect(await api.fetchProducts()).toEqual([product]);
    expect(await api.fetchProduct(7)).toEqual(product);
    expect(await api.fetchWorkById(999)).toBeNull();
    await expect(api.fetchProduct(999)).rejects.toMatchObject({ status: 404 });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/data/wordpress/works.json", "/data/wordpress/featured-works.json",
      "/data/wordpress/pages.json", "/data/wordpress/products.json",
    ]);
  });

  it.each([
    () => new Response("", { status: 404 }),
    () => new Response("<!doctype html><html></html>"),
    () => new Response(JSON.stringify({ code: "error" })),
  ])("non ripiega su WordPress e permette un nuovo tentativo dopo un errore", async failure => {
    fetchMock.mockResolvedValueOnce(failure()).mockResolvedValueOnce(new Response(JSON.stringify([work])));
    const { fetchWorks } = await import("./api");
    await expect(fetchWorks()).rejects.toThrow();
    expect(await fetchWorks()).toEqual([work]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every(([url]) => url === "/data/wordpress/works.json")).toBe(true);
  });

  it("mantiene richieste e configurazione upload sulle API live", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true })));
    const api = await import("./api");
    await api.fetchAttachmentConfig();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true })));
    await api.submitQuoteRequest({ flow: "gift_request", name: "Test", email: "test@example.com",
      description: "Descrizione richiesta", desired_delivery_date: "2027-01-01", privacy_accepted: true });
    expect(fetchMock.mock.calls[0][0]).toContain("/wp-json/portfolio-letizia/v1/attachments/config");
    expect(fetchMock.mock.calls[1][0]).toContain("/wp-json/portfolio-letizia/v1/requests");
    expect(fetchMock.mock.calls[1][1].method).toBe("POST");
  });

  it("lo store segnala un errore prodotti senza marcarli caricati e consente il retry", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([product])));
    const { useContentStore } = await import("../store/useContentStore");
    expect(await useContentStore.getState().loadProducts()).toEqual([]);
    expect(useContentStore.getState().productsLoaded).toBe(false);
    expect(useContentStore.getState().errors.products).toBe(true);
    expect(await useContentStore.getState().loadProducts()).toEqual([product]);
    expect(useContentStore.getState().productsLoaded).toBe(true);
    expect(useContentStore.getState().errors.products).toBe(false);
  });
});
