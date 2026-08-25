import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "../utils/usePageMeta";
import "../style/FlowOne.css";

type ShopPlaceholderProps = {
  section: "account" | "favorites";
};

const ShopPlaceholder = ({ section }: ShopPlaceholderProps) => {
  const { t } = useTranslation();
  const title = t(`shopPlaceholder.${section}.title`);
  const description = t(`shopPlaceholder.${section}.description`);
  usePageMeta(title, description, `/${section}`, true);

  return (
    <section className="shop-placeholder">
      <p className="shop-placeholder__eyebrow">{t("shopPlaceholder.status")}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/products">{t("shopPlaceholder.backToProducts")}</Link>
    </section>
  );
};

export default ShopPlaceholder;
