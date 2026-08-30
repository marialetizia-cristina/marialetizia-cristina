import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import WorksGrid from "../components/WorksGrid";
import { useTranslation } from "react-i18next";

const GiftArt = () => {
    const { t } = useTranslation();

    return (
        <div className="gift-art">
            <Title text={t("portfolio.titleGift")} />
            <Profession name={t("portfolio.headline")} />
            <CategoryContainer />

            <div className="works">
                <WorksGrid category="GIFT IDEAS" limits={190} returnPath="/category/gift-art" />
            </div>
        </div>
    );
};

export default GiftArt;
