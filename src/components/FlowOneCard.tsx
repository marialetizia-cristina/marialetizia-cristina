import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../style/FlowOne.css";

type FlowOneCardProps = {
  variant?: "product" | "project";
  giftIdeasReturnPath?: "/idee-regalo/" | "/en/gift-ideas/";
};

export function FlowOneCard({ variant = "product", giftIdeasReturnPath }: FlowOneCardProps) {
  const { t } = useTranslation();
  const navigationState = giftIdeasReturnPath ? { giftIdeasReturnPath } : undefined;

  if (variant === "project") {
    return (
      <div className="masonry-item">
        <Link className="flow-one-project-card" to="/request/custom-gift" state={navigationState} aria-label={t("request.cardTitle")}>
          <article className="work-card work-card--gift-idea">
            <div className="work-card__media work-card__media--gift-idea" aria-hidden="true">
              <span>{t("products.yourIdea")}</span>
              <div className="work-card__overlay">
                <p className="work-card__commission-note">{t("product.commissionNotice")}</p>
              </div>
            </div>
            <div className="work-card__commerce-summary">
              <div className="work-card__commerce-line">
                <h3>{t("request.cardTitle")}</h3>
              </div>
            </div>
          </article>
        </Link>
      </div>
    );
  }

  return (
    <article className="product-card product-card--gift">
      <Link className="product-card__link" to="/request/custom-gift" state={navigationState} aria-label={t("request.cardTitle")}>
        <div className="product-card__media product-card__media--gift" aria-hidden="true">
          <span>{t("products.yourIdea")}</span>
        </div>
        <h2>{t("request.cardTitle")}</h2>
        <p className="product-card__price">{t("products.requestQuote")}</p>
      </Link>
    </article>
  );
}
