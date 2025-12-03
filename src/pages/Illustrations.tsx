import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import WorksGrid from "../components/WorksGrid";
import { useTranslation } from "react-i18next";

function Illustrations() {
  const { t } = useTranslation();
  return (
    <div className="illustrations">
      <Title text={t("portfolio.titleIllustrations")} />
      <Profession name={t("portfolio.headline")} />
      <CategoryContainer />

      <div className='works'>
        <WorksGrid category="ILLUSTRATIONS" limits={19} returnPath="/category/illustrations" />
      </div>
    </div>
  )
}

export default Illustrations;