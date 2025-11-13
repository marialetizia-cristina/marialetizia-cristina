import '../style/Home.css';
import WorksGrid from '../components/WorksGrid';
import Title from '../components/Title';
import Profession from '../components/Profession';
import CategoryContainer from '../components/CategoryContainer';
import me from '/me.png'

const Home = () => {
  return (
    <div className='home'>
      <Title text="MARIALETIZIA CRISTINA" />
      <Profession />
      <CategoryContainer />
      <div className='works'>
        <WorksGrid />
      </div>
      <hr className='divider' />
      <Title text="ABOUT ME" />
      <hr className='divider' />
      <div className="about-me">
        <img src={me} alt="me" className='me' />
        <div>
          <h3>
            GRAPHIC DESIGNER AND ILLUSTRATOR
          </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, reprehenderit. Id, similique? Laborum minima eius voluptate hic sint consectetur et sunt tempore soluta? Repellendus consectetur nulla perspiciatis! Aliquam, eius necessitatibus.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;