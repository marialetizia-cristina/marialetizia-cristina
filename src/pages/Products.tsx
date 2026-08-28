import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProducts, type CatalogProduct } from "../api/api";
import { FlowOneCard } from "../components/FlowOneCard";
import "../style/Products.css";
import { usePageMeta } from "../utils/usePageMeta";

type CategoryFilter = "all" | "graphic-design" | "illustrations" | "gift-ideas";
type TagFilter = "all" | "caricature" | "carte-da-gioco" | "album" | "calendari" | "illustrazioni" | "copertine";

const categoryFilters: CategoryFilter[] = ["all", "graphic-design", "illustrations", "gift-ideas"];
const tagFilters: TagFilter[] = ["all", "caricature", "carte-da-gioco", "album", "calendari", "illustrazioni", "copertine"];

const categoryAliases: Record<Exclude<CategoryFilter, "all">, string[]> = {
  "graphic-design": ["graphic-design"],
  illustrations: ["illustrations", "illustrazioni"],
  "gift-ideas": ["gift-ideas", "idee-regalo", "gift-art"],
};

const tagAliases: Record<Exclude<TagFilter, "all">, string[]> = {
  caricature: ["caricature"],
  "carte-da-gioco": ["carte-da-gioco", "playing-cards"],
  album: ["album"],
  calendari: ["calendari", "calendars"],
  illustrazioni: ["illustrazioni", "illustrations"],
  copertine: ["copertine", "covers"],
};

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [tag, setTag] = useState<TagFilter>("all");
  usePageMeta(t("products.title"), t("products.intro"), "/products");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : t("products.loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const categoryMatches = category === "all"
      || (product.categories ?? []).some((term) => categoryAliases[category].includes(term.slug));
    const tagMatches = tag === "all"
      || (product.tags ?? []).some((term) => tagAliases[tag].includes(term.slug));
    return categoryMatches && tagMatches;
  }), [category, products, tag]);

  const showGiftRequest = (category === "all" || category === "gift-ideas") && tag === "all";
  const visibleCount = filteredProducts.length + (showGiftRequest ? 1 : 0);

  return (
    <section className="products-page">
      <header className="products-page__header">
        <h1>{t("products.title")}</h1>
        <p>{t("products.subtitle")}</p>
      </header>
      <div className="product-filters">
        <div className="product-filters__categories" aria-label={t("products.categoryFilterLabel")}>
          {categoryFilters.map((value) => (
            <button
              key={value}
              type="button"
              className={`product-filter product-filter--${value}`}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {t(`products.categories.${value}`)}
            </button>
          ))}
        </div>
        <div className="product-filters__tags" aria-label={t("products.tagFilterLabel")}>
          {tagFilters.map((value) => (
            <button key={value} type="button" aria-pressed={tag === value} onClick={() => setTag(value)}>
              {t(`products.tags.${value}`)}
            </button>
          ))}
        </div>
      </div>
      {loading && <p className="products-page__state" role="status">{t("products.loading")}</p>}
      {error && <p className="products-page__state" role="alert">{error}</p>}
      {!loading && !error && visibleCount === 0 && <p className="products-page__state">{t("products.noFilterResults")}</p>}
      <div className="products-list">
        {showGiftRequest && <FlowOneCard />}
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <Link className="product-card__link" to={`/products/${product.id}`} aria-label={product.name}>
              <div className="product-card__media">
                {product.image
                  ? <img src={product.image.src} alt={product.image.alt || product.name} loading="lazy" />
                  : <span className="product-card__placeholder" aria-hidden="true">PL</span>}
              </div>
              <h2>{product.name}</h2>
              <div className="product-card__price">
                {product.flow === "variable_quote"
                  ? product.indicative_price_range || t("products.priceOnRequest")
                  : product.price_html
                    ? <span dangerouslySetInnerHTML={{ __html: product.price_html }} />
                    : t("products.unavailable")}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Products;
