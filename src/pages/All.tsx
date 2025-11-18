import CategoryContainer from "../components/CategoryContainer";
import Profession from "../components/Profession";
import Title from "../components/Title";
import WorksGrid from "../components/WorksGrid";

function All() {
  return (
    <div className="all">
      <Title text="ALL" />
      <Profession name="PORTFOLIO" />
      <CategoryContainer />

      <div className='works'>
        <WorksGrid category="ALL" limits={19} returnPath="/category/all" />
      </div>
    </div>
  )
}

export default All;