import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProduct, type Product } from "../api/storeApi";
import { useCartStore } from "../store/useCartStore";
import "../style/ProductDetail.css";

const ProductDetail = () => {
  const { t } = useTranslation();
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToCart = useCartStore(state => state.addToCart);
  const items = useCartStore(state => state.items);

  useEffect(() => {
    const numericProductId = Number(productId);
    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      setError(t("product.notFound"));
      setLoading(false);
      return;
    }

    let active = true;
    void fetchProduct(numericProductId)
      .then(data => {
        if (active) setProduct(data);
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
  }, [productId, t]);

  if (loading) {
    return <div className="product-detail-container"><div className="loading">{t("product.loading")}</div></div>;
  }
  if (error) {
    return <div className="product-detail-container"><div className="error">{t("product.error")}: {error}</div></div>;
  }
  if (!product) {
    return <div className="product-detail-container"><div className="error">{t("product.notFound")}</div></div>;
  }

  const isInCart = items.some(item => item.id === product.id);

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">← {t("product.backToProducts")}</Link>
      <h1 className="product-title">{product.name}</h1>
      {product.images[0] && (
        <img
          src={product.images[0].src}
          alt={product.images[0].alt || product.name}
          className="product-main-image"
        />
      )}
      <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
      <div className="product-price">{product.formattedPrice}</div>
      <button
        type="button"
        className="add-to-cart-button"
        onClick={() => addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]?.src,
          permalink: product.permalink,
        })}
        disabled={isInCart}
      >
        {isInCart ? t("product.addedToCart") : t("product.addToCart")}
      </button>
    </div>
  );
};

export default ProductDetail;
