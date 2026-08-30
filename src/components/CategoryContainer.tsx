import "../style/CategoryContainer.css";
import CategoryButton from "./CategoryButton";

import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";


const CategoryContainer = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === "/" || location.pathname === "/en" || location.pathname === "/en/";

    return (
        <div className="category-container-wrapper">
            {isHome && <div className="divider" />}
            <div className="category-container">
                <CategoryButton name={t("categories.all")?.toUpperCase()} path="/category/all" />
                <CategoryButton name={t("categories.graphicDesign")?.toUpperCase()} path="/category/graphic-design" />
                <CategoryButton name={t("categories.illustrations")?.toUpperCase()} path="/category/illustrations" />
                <CategoryButton name={t("categories.giftArt")?.toUpperCase()} path="/category/gift-art" />
                <Link
                    className="category-container__gift-cta"
                    to={i18n.language.startsWith("en") ? "/en/gift-ideas/" : "/idee-regalo/"}
                >
                    {t("categories.createGiftIdea").toUpperCase()}
                </Link>
            </div>
            <div className="divider" />
        </div>
    );
};

export default CategoryContainer;
