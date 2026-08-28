import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "../utils/usePageMeta";
import "../style/FlowOne.css";

const ShopPlaceholder = () => {
  const { t, i18n } = useTranslation();
  const title = t("shopPlaceholder.profile.title");
  const description = t("shopPlaceholder.profile.description");
  const profilePath = i18n.language.startsWith("en") ? "/en/profile" : "/profilo";
  usePageMeta(title, description, profilePath, true);

  return (
    <section className="shop-placeholder">
      <p className="shop-placeholder__eyebrow">{t("shopPlaceholder.status")}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/category/all">{t("shopPlaceholder.backToProjects")}</Link>
    </section>
  );
};

export default ShopPlaceholder;
