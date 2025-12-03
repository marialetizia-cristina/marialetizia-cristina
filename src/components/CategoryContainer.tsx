import "../style/CategoryContainer.css";
import CategoryButton from "./CategoryButton";
import { useTranslation } from "react-i18next";

const CategoryContainer = () => {
    const { t } = useTranslation();

    return (
        <div className="category-container-wrapper">
            <div className="category-container">
                <CategoryButton name={t("categories.all")?.toUpperCase()} path="/category/all" />
                <CategoryButton name={t("categories.graphicDesign")?.toUpperCase()} path="/category/graphic-design" />
                <CategoryButton name={t("categories.illustrations")?.toUpperCase()} path="/category/illustrations" />
                <CategoryButton name={t("categories.giftArt")?.toUpperCase()} path="/category/gift-art" />
            </div>
            <hr />
        </div>
    );
};

export default CategoryContainer;