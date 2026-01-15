import "../style/CategoryContainer.css";
import CategoryButton from "./CategoryButton";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";


const CategoryContainer = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="category-container-wrapper">
            {isHome && <div className="divider" />}
            <div className="category-container">
                <CategoryButton name={t("categories.all")?.toUpperCase()} path="/category/all" />
                <CategoryButton name={t("categories.graphicDesign")?.toUpperCase()} path="/category/graphic-design" />
                <CategoryButton name={t("categories.illustrations")?.toUpperCase()} path="/category/illustrations" />
                <CategoryButton name={t("categories.giftArt")?.toUpperCase()} path="/products" />
            </div>
            <div className="divider" />
        </div>
    );
};

export default CategoryContainer;