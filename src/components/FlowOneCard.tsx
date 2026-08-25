import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../style/FlowOne.css";

export function FlowOneCard() {
  const { t } = useTranslation();

  return (
    <article className="product-card product-card--gift">
      <Link className="product-card__link" to="/request/custom-gift" aria-label={t("request.cardTitle")}>
        <div className="product-card__media product-card__media--gift" aria-hidden="true">
          <span>{t("products.yourIdea")}</span>
        </div>
        <h2>{t("request.cardTitle")}</h2>
        <p className="product-card__price">{t("products.requestQuote")}</p>
      </Link>
    </article>
  );
}
