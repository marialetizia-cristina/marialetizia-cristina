import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import WorksGrid from "../components/WorksGrid";

function Illustrations() {
  return (
    <div className="illustrations">
      <Title text="ILLUSTRATIONS" />
      <Profession name="PORTFOLIO" />
      <CategoryContainer />

      <div className='works'>
        <WorksGrid category="ILLUSTRATIONS" limits={19} />
      </div>
    </div>
  )
}

export default Illustrations;