import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../style/GiftArt.css";

const GiftArt = () => {
    const { t } = useTranslation();

    return (
        <div className="gift-art">
            <Title text={t("portfolio.titleGift")} />
            <Profession name={t("portfolio.headline")} />
            <CategoryContainer />

            <div className="works gift-art__notice-wrapper">
                <section className="gift-art__notice">
                    <h2 className="gift-art__notice-title">{t("giftArt.notice.title")}</h2>
                    <p className="gift-art__notice-body">{t("giftArt.notice.body")}</p>
                    <Link className="gift-art__cta" to="/category/all">
                        {t("giftArt.notice.cta")}
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default GiftArt;
