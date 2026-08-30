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
import { todayForDateInput } from "../utils/date";

type ProjectCommerceProps = {
  product: CatalogProduct;
  showDescription?: boolean;
  projectTitle?: string;
};

const ProjectCommerce = ({ product, showDescription = true, projectTitle }: ProjectCommerceProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [customization, setCustomization] = useState("");
  const [added, setAdded] = useState(false);
  const [attachmentConfig, setAttachmentConfig] = useState<AttachmentConfig | null>(null);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [hasTriedAddToCart, setHasTriedAddToCart] = useState(false);
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState("");
  const addToCart = useCartStore(state => state.addToCart);
  const cartLoading = useCartStore(state => state.loading);
  const cartError = useCartStore(state => state.error);

  useEffect(() => {
    fetchAttachmentConfig().then(setAttachmentConfig).catch(() => setAttachmentConfig(null));
  }, []);

  return (
    <section className="project-commerce" aria-label={t("product.commercialDetails")}>
      <p className="project-commerce__eyebrow">
        {product.flow === "variable_quote" ? t("products.quoteProduct") : t("products.fixedProduct")}
      </p>
      {(product.flow === "variable_quote" || product.flow === "fixed_purchase") && (
        <p className="project-commerce__commission-note">{t("product.commissionNotice")}</p>
      )}
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
            state={{ from: location.pathname, projectTitle }}
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
          <label className="product-customization product-delivery-date">
            <span>{t("request.fields.desiredDeliveryDate")}</span>
            <input
              type="date"
              value={desiredDeliveryDate}
              min={todayForDateInput()}
              required
              onChange={event => setDesiredDeliveryDate(event.target.value)}
            />
            <small>{t("request.fields.desiredDeliveryDateHelp")}</small>
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
          {hasTriedAddToCart && cartError && (
            <p className="error" role="alert">
              {/failed to fetch|networkerror|load failed/i.test(cartError) ? t("cart.connectionError") : cartError}
            </p>
          )}
          <button
            className="add-to-cart-button"
            type="button"
            onClick={async () => {
              if (!customization.trim()) return;
              setHasTriedAddToCart(true);
              try {
                const tokens = await uploadAttachments(attachments, attachmentConfig?.max_files);
                await addToCart(product.id, {
                  project_title: projectTitle?.trim() || product.name,
                  description: customization.trim(),
                  desired_delivery_date: desiredDeliveryDate,
                }, tokens);
                setAdded(true);
              } catch {
                // The cart store exposes the trusted WooCommerce error message.
              }
            }}
            disabled={added || cartLoading || !customization.trim() || !desiredDeliveryDate || !product.purchasable || !product.in_stock}
          >
            {added ? t("product.addedToCart") : cartLoading ? t("product.addingToCart") : t("product.addToCart")}
          </button>
        </>
      ) : null}
    </section>
  );
};

export default ProjectCommerce;
