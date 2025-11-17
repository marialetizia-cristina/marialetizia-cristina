import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import WorksGrid from "../components/WorksGrid";

function GraphicDesign() {
  return (
    <div className="graphic-design">
      <Title text="GRAPHIC DESIGN" />
      <Profession name="PORTFOLIO" />
      <CategoryContainer />

      <div className='works'>
        <WorksGrid category="GRAPHIC DESIGN" limits={19} />
      </div>
    </div>
  )
}

export default GraphicDesign;