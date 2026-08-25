import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "../utils/usePageMeta";

const NotFound = () => {
  const { t } = useTranslation();
  usePageMeta(t("notFound.title"), t("notFound.body"), window.location.pathname, true);
  return (
    <section className="products-page">
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.body")}</p>
      <Link to="/">{t("notFound.home")}</Link>
    </section>
  );
};

export default NotFound;
