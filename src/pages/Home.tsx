import '../style/Home.css';
import WorksGrid from '../components/WorksGrid';
import Title from '../components/Title';
import Profession from '../components/Profession';
import CategoryContainer from '../components/CategoryContainer';

const Home = () => {
  return (
    <div className='home'>
      <Title text="MARIALETIZIA CRISTINA" />
      <Profession  />
      <CategoryContainer />
      <div className='works'>
        <WorksGrid />
      </div>
    </div>
  );
}

export default Home;