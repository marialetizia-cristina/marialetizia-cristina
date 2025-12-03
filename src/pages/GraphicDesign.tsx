import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import WorksGrid from "../components/WorksGrid";
import { useTranslation } from "react-i18next";

function GraphicDesign() {
  const { t } = useTranslation();
  return (
    <div className="graphic-design">
      <Title text={t("portfolio.titleGraphic")} />
      <Profession name={t("portfolio.headline")} />
      <CategoryContainer />

      <div className='works'>
        <WorksGrid category="GRAPHIC DESIGN" limits={19} returnPath="/category/graphic-design" />
      </div>
    </div>
  )
}

export default GraphicDesign;