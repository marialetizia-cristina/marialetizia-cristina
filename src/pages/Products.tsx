import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProducts, type Product } from "../api/storeApi";
import { useCartStore } from "../store/useCartStore";
import LoadingState from "../components/LoadingState";
import "../style/Products.css";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToCart = useCartStore(state => state.addToCart);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;

    void fetchProducts()
      .then(data => {
        if (active) setProducts(data);
      })
      .catch(fetchError => {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : t("product.loadError"));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  if (loading) return <LoadingState message={t("product.loading")} />;
  if (error) {
    return <div className="products-page products-page__status">{t("product.error")}: {error}</div>;
  }

  return (
    <section className="products-page">
      <h1>{t("nav.products")}</h1>
      <div className="products-list">
        {products.map(product => (
          <article
            className="product-card"
            key={product.id}
            tabIndex={0}
            role="link"
            onClick={() => navigate(`/products/${product.id}`)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                navigate(`/products/${product.id}`);
              }
            }}
          >
            {product.images[0] && (
              <img src={product.images[0].src} alt={product.images[0].alt || product.name} />
            )}
            <h2>{product.name}</h2>
            <div className="price">{product.formattedPrice}</div>
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0]?.src,
                  permalink: product.permalink,
                });
              }}
            >
              {t("product.addToCart")}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Products;
