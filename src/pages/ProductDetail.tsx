import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAttachmentConfig, fetchProduct, uploadAttachments, type AttachmentConfig, type CatalogProduct } from "../api/api";
import { useCartStore } from "../store/useCartStore";
import { FileInput } from "../components/form";
import "../style/ProductDetail.css";

const ProductDetail = () => {
  const { t } = useTranslation();
  const { productId } = useParams();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customization, setCustomization] = useState("");
  const [added, setAdded] = useState(false);
  const [attachmentConfig, setAttachmentConfig] = useState<AttachmentConfig | null>(null);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartLoading = useCartStore((state) => state.loading);
  const cartError = useCartStore((state) => state.error);

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
  useEffect(() => { fetchAttachmentConfig().then(setAttachmentConfig).catch(() => setAttachmentConfig(null)); }, []);

  if (loading) return <div className="product-detail-container"><p className="loading">{t("product.loading")}</p></div>;
  if (error || !product) return <div className="product-detail-container"><p className="error">{error ?? t("product.notFound")}</p></div>;

  const isQuoteProduct = product.flow === "variable_quote";

  return (
    <article className="product-detail-container">
      <Link to="/products" className="back-link">← {t("product.backToProducts")}</Link>
      <h1 className="product-title">{product.name}</h1>
      {product.image && <img src={product.image.src} alt={product.image.alt || product.name} className="product-main-image" />}
      <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
      {isQuoteProduct ? (
        <>
          <p className="product-price">{product.indicative_price_range || t("products.priceOnRequest")}</p>
          <p className="product-quote-notice">{t("product.quoteNotice")}</p>
          <Link className="add-to-cart-button" to={`/products/${product.id}/request`}>{t("product.requestQuote")}</Link>
        </>
      ) : (
        <>
          <div className="product-price" dangerouslySetInnerHTML={{ __html: product.price_html }} />
          <label className="product-customization">
            <span>{t("product.customizationLabel")}</span>
            <textarea value={customization} rows={5} required placeholder={t("product.customizationPlaceholder")} onChange={(event) => setCustomization(event.target.value)} />
          </label>
          {attachmentConfig?.enabled && (
            <FileInput
              type="file"
              name="attachments"
              label={t("request.fields.attachments")}
              description={t("request.fields.attachmentsConfiguredHelp", { count: attachmentConfig.max_files, mb: Math.floor(attachmentConfig.max_bytes / 1048576) })}
              accept={attachmentConfig.accepted_mime_types.join(",")}
              multiple={attachmentConfig.max_files > 1}
              onChange={setAttachments}
            />
          )}
          {cartError && <p className="error" role="alert">{cartError}</p>}
          <button
            className="add-to-cart-button"
            onClick={async () => {
              if (!customization.trim()) return;
              try {
                const attachmentTokens = await uploadAttachments(attachments, attachmentConfig?.max_files);
                await addToCart(product.id, { description: customization.trim() }, attachmentTokens);
                setAdded(true);
              } catch {
                // Lo store espone già il messaggio restituito da WooCommerce.
              }
            }}
            disabled={added || cartLoading || !customization.trim() || !product.purchasable || !product.in_stock}
          >
            {added ? t("product.addedToCart") : cartLoading ? t("product.addingToCart") : t("product.addToCart")}
          </button>
        </>
      )}
    </article>
  );
};

export default ProductDetail;
