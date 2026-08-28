import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProduct, type CatalogProduct } from "../api/api";
import ProjectCommerce from "../components/ProjectCommerce";
import "../style/ProductDetail.css";

const ProductDetail = () => {
  const { t } = useTranslation();
  const { productId } = useParams();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
      setError(t("product.notFound"));
      setLoading(false);
      return;
    }
    fetchProduct(id)
      .then(setProduct)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : t("product.loadError")))
      .finally(() => setLoading(false));
  }, [productId, t]);

  if (loading) return <div className="product-detail-container"><p className="loading">{t("product.loading")}</p></div>;
  if (error || !product) return <div className="product-detail-container"><p className="error">{error ?? t("product.notFound")}</p></div>;

  return (
    <article className="product-detail-container">
      <Link to="/category/all" className="back-link">← {t("product.backToProjects")}</Link>
      <h1 className="product-title">{product.name}</h1>
      {product.image && <img src={product.image.src} alt={product.image.alt || product.name} className="product-main-image" />}
      <ProjectCommerce product={product} />
    </article>
  );
};

export default ProductDetail;
