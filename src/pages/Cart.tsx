import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import "../style/Cart.css";
import { usePageMeta } from "../utils/usePageMeta";
import { formatStoreMoney } from "../utils/money";
import { getLinkedProductId } from "../api/api";
import { useContentStore } from "../store/useContentStore";
import { normalizeLanguage } from "../utils/language";

const normalizeMetadataKey = (key: string) => key.trim().toLowerCase().replace(/[\s-]+/g, "_");
const isAttachmentMetadata = (key: string) => {
  const normalizedKey = normalizeMetadataKey(key);
  return normalizedKey.includes("attachment") || normalizedKey.includes("allegat") || normalizedKey.includes("file");
};

const parseAttachmentNames = (values: string[]): string[] => {
  const names = values.flatMap(value => {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.filter((name): name is string => typeof name === "string");
    } catch {
      // Older cart data can contain a plain, separator-delimited value.
    }
    return value.split(/[|,\n]/);
  });

  return names.map(name => name.trim()).filter(Boolean);
};

const Cart = () => {
  const { t, i18n } = useTranslation();
  const { cart, loading, error, loadCart, removeFromCart, updateQuantity } = useCartStore();
  const works = useContentStore(state => state.works);
  const loadWorks = useContentStore(state => state.loadWorks);
  const displayError = error && /failed to fetch|networkerror|load failed/i.test(error)
    ? t("cart.connectionError")
    : error;
  usePageMeta(t("cart.title"), t("cart.empty"), "/cart", true);

  useEffect(() => {
    void loadCart();
    void loadWorks();
  }, [loadCart, loadWorks]);

  const projectsByProductId = useMemo(() => {
    const language = normalizeLanguage(i18n.language) || "it";
    const projects = new Map<number, { title: string; image?: { src: string; alt: string } }>();

    works.forEach(work => {
      const productId = getLinkedProductId(work);
      const workLanguage = normalizeLanguage(work.polylang?.lang || work.lang);
      if (!productId || workLanguage !== language || projects.has(productId)) return;

      const template = document.createElement("template");
      template.innerHTML = work.title.rendered;
      const title = template.content.textContent?.trim() || work.title.rendered;
      const featuredImage = work._embedded?.["wp:featuredmedia"]?.[0];
      const preferredImage = featuredImage?.media_details?.sizes?.medium_large
        ?? featuredImage?.media_details?.sizes?.medium
        ?? featuredImage;

      projects.set(productId, {
        title,
        image: preferredImage?.source_url ? {
          src: preferredImage.source_url,
          alt: featuredImage?.alt_text?.trim() || title,
        } : undefined,
      });
    });

    return projects;
  }, [i18n.language, works]);

  if (loading && !cart) return <p className="cart-page__state">{t("cart.loading")}</p>;
  if (displayError && !cart) return <p className="cart-page__state" role="alert">{displayError}</p>;
  if (!cart || cart.items.length === 0) return <section className="cart-page"><h1>{t("cart.title")}</h1><p>{t("cart.empty")}</p><Link to="/category/all">{t("cart.continueShopping")}</Link></section>;

  return (
    <section className="cart-page">
      <h1>{t("cart.title")}</h1>
      {displayError && <p role="alert">{displayError}</p>}
      <ul className="cart-list">
        {cart.items.map((item) => {
          const storedProjectTitle = item.item_data.find(data => normalizeMetadataKey(data.key) === "project_title")?.value;
          const project = projectsByProductId.get(item.id);
          const projectTitle = project?.title || storedProjectTitle || item.name;
          const attachmentMetadata = item.item_data.filter(data => isAttachmentMetadata(data.key));
          const explicitAttachmentNames = attachmentMetadata.filter(data => {
            const key = normalizeMetadataKey(data.key);
            return key === "attachment_names" || key === "nomi_file" || key === "nomi_file_allegati";
          });
          const attachmentNames = parseAttachmentNames(
            (explicitAttachmentNames.length > 0 ? explicitAttachmentNames : attachmentMetadata).map(data => data.value),
          );
          const visibleMetadata = item.item_data.filter(data => {
            const key = normalizeMetadataKey(data.key);
            return key !== "project_title" && !isAttachmentMetadata(data.key);
          });

          return (
          <li className={`cart-item ${project?.image ? "cart-item--with-image" : ""}`} key={item.key}>
            {project?.image && <img src={project.image.src} alt={project.image.alt} />}
            <div className="cart-item__content">
              <h2>{projectTitle}</h2>
              {visibleMetadata.map((data) => (
                <p className="cart-item__metadata" key={`${data.key}-${data.value}`}>
                  <strong>{data.key}:</strong> {data.value}
                </p>
              ))}
              <div className="cart-item__attachments">
                <strong>{t("cart.attachments")}:</strong>
                {attachmentNames.length > 0 ? (
                  <ul>
                    {attachmentNames.slice(0, 2).map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}
                    {attachmentNames.length > 2 && <li aria-label={t("cart.moreAttachments")}>…</li>}
                  </ul>
                ) : (
                  <span>{t("cart.noAttachments")}</span>
                )}
              </div>
            </div>
            <div className="cart-item__actions">
              <label className="cart-item__quantity-column">
                <span>{t("cart.quantity")}</span>
                <span className="cart-item__quantity">
                  <button type="button" disabled={loading || item.quantity <= 1} onClick={() => void updateQuantity(item.key, item.quantity - 1)} aria-label={t("cart.decreaseQuantity", { product: item.name })}>−</button>
                  <output aria-live="polite">{item.quantity}</output>
                  <button type="button" disabled={loading} onClick={() => void updateQuantity(item.key, item.quantity + 1)} aria-label={t("cart.increaseQuantity", { product: item.name })}>+</button>
                </span>
              </label>
              <button className="cart-item__remove" type="button" disabled={loading} onClick={() => void removeFromCart(item.key)}>{t("cart.remove")}</button>
              <p className="cart-item__price">{formatStoreMoney(item.totals.line_total, item.totals)}</p>
            </div>
          </li>
          );
        })}
      </ul>
      <div className="cart-page__summary">
        <p><strong>{t("cart.total")}:</strong> {formatStoreMoney(cart.totals.total_price, cart.totals)}</p>
        <Link className="cart-page__checkout" to="/checkout">{t("cart.checkout")}</Link>
      </div>
    </section>
  );
};

export default Cart;
