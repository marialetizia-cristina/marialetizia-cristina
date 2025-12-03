import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import WorksGrid from "../components/WorksGrid";
import { useTranslation } from "react-i18next";

function All() {
  const { t } = useTranslation();
  return (
    <div className="all">
      <Title text={t("portfolio.titleAll")} />
      <Profession name={t("portfolio.headline")} />
      <CategoryContainer />

      <div className='works'>
        <WorksGrid category="ALL" limits={19} returnPath="/category/all" />
      </div>
    </div>
  )
}

export default All;