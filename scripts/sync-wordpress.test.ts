import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syncWordPress } from "./sync-wordpress.ts";

const post = (id: number) => ({ id, title: { rendered: `Titolo ${id}` }, content: { rendered: "Testo" },
  status: "publish", categories: id === 1 ? [14] : [], lang: "it", linked_product_id: 7 });
const product = { id: 7, name: "Prodotto", flow: "fixed_purchase", physical: true,
  purchasable: true, in_stock: true, price: "50" };
function response(data: unknown, total?: number, pages = 1): Response {
  return new Response(JSON.stringify(data), { headers: total === undefined ? {} : {
    "X-WP-Total": String(total), "X-WP-TotalPages": String(pages),
  } });
}
function api(override?: (url: URL) => Response | undefined): typeof fetch {
  return async input => {
    const url = new URL(String(input));
    const custom = override?.(url);
    if (custom) return custom;
    if (url.pathname.endsWith("/posts")) {
      assert.equal(url.searchParams.get("lang"), "all");
      assert.equal(url.searchParams.get("status"), "publish");
      assert.ok(url.searchParams.get("_embed"));
      return response([post(Number(url.searchParams.get("page")))], 2, 2);
    }
    if (url.pathname.endsWith("/pages")) return response([], 0, 0);
    return response([product]);
  };
}

test("paginazione completa, featured derivati, lingue e relazioni conservate; output stabile", async t => {
  const outputDir = await mkdtemp(join(tmpdir(), "wordpress-sync-test-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));
  const options = { outputDir, fetcher: api() };
  assert.deepEqual(await syncWordPress(options), {
    "works.json": 2, "featured-works.json": 1, "pages.json": 0, "products.json": 1,
  });
  const before = await readFile(join(outputDir, "works.json"), "utf8");
  assert.equal(JSON.parse(before)[0].linked_product_id, 7);
  assert.equal(JSON.parse(before)[0].lang, "it");
  assert.equal(JSON.parse(await readFile(join(outputDir, "featured-works.json"), "utf8"))[0].id, 1);
  await syncWordPress(options);
  assert.equal(await readFile(join(outputDir, "works.json"), "utf8"), before);
  assert.equal((await readdir(outputDir)).length, 4);
});

for (const scenario of ["http", "headers", "duplicate", "count", "invalid", "products"] as const) {
  test(`errore ${scenario}: conserva lo snapshot precedente`, async t => {
    const outputDir = await mkdtemp(join(tmpdir(), "wordpress-sync-test-"));
    t.after(() => rm(outputDir, { recursive: true, force: true }));
    await writeFile(join(outputDir, "works.json"), "precedente");
    const fetcher = api(url => {
      if (scenario === "products" && url.pathname.endsWith("/products")) return new Response("", { status: 404 });
      if (!url.pathname.endsWith("/posts")) return;
      if (scenario === "http" && url.searchParams.get("page") === "2") return new Response("", { status: 503 });
      if (scenario === "headers") return response([post(1)]);
      if (scenario === "duplicate") return response([post(1)], 2, 2);
      if (scenario === "count") return response([post(1)], 2);
      if (scenario === "invalid") return response([{ id: 1 }], 1);
    });
    await assert.rejects(syncWordPress({ outputDir, fetcher }));
    assert.equal(await readFile(join(outputDir, "works.json"), "utf8"), "precedente");
    assert.deepEqual(await readdir(outputDir), ["works.json"]);
  });
}

test("catalogo vuoto valido rimuove i vecchi record; prodotti paginati supportati", async t => {
  const outputDir = await mkdtemp(join(tmpdir(), "wordpress-sync-test-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));
  await syncWordPress({ outputDir, fetcher: api() });
  await syncWordPress({ outputDir, fetcher: api(url => {
    if (url.pathname.endsWith("/posts")) return response([], 0, 0);
    if (url.pathname.endsWith("/products")) {
      return response([{ ...product, id: Number(url.searchParams.get("page")) }], 2, 2);
    }
  }) });
  assert.deepEqual(JSON.parse(await readFile(join(outputDir, "works.json"), "utf8")), []);
  assert.equal(JSON.parse(await readFile(join(outputDir, "products.json"), "utf8")).length, 2);
});
