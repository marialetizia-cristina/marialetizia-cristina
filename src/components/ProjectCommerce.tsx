import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchAttachmentConfig,
  uploadAttachments,
  type AttachmentConfig,
  type CatalogProduct,
} from "../api/api";
import { useCartStore } from "../store/useCartStore";
import { FileInput } from "./form";
import "../style/ProductDetail.css";

type ProjectCommerceProps = {
  product: CatalogProduct;
  showDescription?: boolean;
};

const ProjectCommerce = ({ product, showDescription = true }: ProjectCommerceProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [customization, setCustomization] = useState("");
  const [added, setAdded] = useState(false);
  const [attachmentConfig, setAttachmentConfig] = useState<AttachmentConfig | null>(null);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const addToCart = useCartStore(state => state.addToCart);
  const cartLoading = useCartStore(state => state.loading);
  const cartError = useCartStore(state => state.error);

  useEffect(() => {
    fetchAttachmentConfig().then(setAttachmentConfig).catch(() => setAttachmentConfig(null));
  }, []);

  return (
    <section className="project-commerce" aria-labelledby="project-commerce-title">
      <p className="project-commerce__eyebrow">
        {product.flow === "variable_quote" ? t("products.quoteProduct") : t("products.fixedProduct")}
      </p>
      <h2 id="project-commerce-title">{product.name}</h2>
      {showDescription && product.description && (
        <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
      )}

      {product.flow === "variable_quote" ? (
        <>
          {product.indicative_price_range && (
            <p className="product-price">{product.indicative_price_range}</p>
          )}
          <p className="product-quote-notice">{t("product.quoteNotice")}</p>
          <Link
            className="add-to-cart-button"
            to={`/products/${product.id}/request`}
            state={{ from: location.pathname }}
          >
            {t("product.requestQuote")}
          </Link>
        </>
      ) : product.flow === "fixed_purchase" ? (
        <>
          {product.price_html && (
            <div className="product-price" dangerouslySetInnerHTML={{ __html: product.price_html }} />
          )}
          <label className="product-customization">
            <span>{t("product.customizationLabel")}</span>
            <textarea
              value={customization}
              rows={5}
              required
              placeholder={t("product.customizationPlaceholder")}
              onChange={event => setCustomization(event.target.value)}
            />
          </label>
          {attachmentConfig?.enabled && (
            <FileInput
              type="file"
              name="attachments"
              label={t("request.fields.attachments")}
              description={t("request.fields.attachmentsConfiguredHelp", {
                count: attachmentConfig.max_files,
                mb: Math.floor(attachmentConfig.max_bytes / 1048576),
              })}
              accept={attachmentConfig.accepted_mime_types.join(",")}
              multiple={attachmentConfig.max_files > 1}
              onChange={setAttachments}
            />
          )}
          {cartError && <p className="error" role="alert">{cartError}</p>}
          <button
            className="add-to-cart-button"
            type="button"
            onClick={async () => {
              if (!customization.trim()) return;
              try {
                const tokens = await uploadAttachments(attachments, attachmentConfig?.max_files);
                await addToCart(product.id, { description: customization.trim() }, tokens);
                setAdded(true);
              } catch {
                // The cart store exposes the trusted WooCommerce error message.
              }
            }}
            disabled={added || cartLoading || !customization.trim() || !product.purchasable || !product.in_stock}
          >
            {added ? t("product.addedToCart") : cartLoading ? t("product.addingToCart") : t("product.addToCart")}
          </button>
        </>
      ) : null}
    </section>
  );
};

export default ProjectCommerce;
