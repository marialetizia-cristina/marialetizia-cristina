import { useEffect, useState } from "react";
import { fetchPages } from "../api/api";
import type { Page } from "../api/api";

import '../style/Home.css';
import WorksGrid from '../components/WorksGrid';
import Title from '../components/Title';
import Profession from '../components/Profession';
import CategoryContainer from '../components/CategoryContainer';
import Section from '../components/Section';

const Home = () => {

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await fetchPages();
      setPages(result);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='home'>
      <Title text="MARIALETIZIA CRISTINA" />
      <Profession />
      <CategoryContainer />

      <div className='works'>
        <WorksGrid />
      </div>

      <div className="about-container">
        <div className="title-container">
          <hr className='divider' />
          <Title text="ABOUT ME" />
          <hr className='divider' />
        </div>
        <Section page={pages[2]} id="about" />
      </div>

      <div className="services-container">
        <div className="title-container">
          <hr className='divider' />
          <Title text="SERVICES" />
          <hr className='divider' />
        </div>
        <Section page={pages[0]} id="services" />
      </div>

      <div className="services-container">
        <div className="title-container">
          <hr className='divider' />
          <Title text="CONTACT" />
          <hr className='divider' />
        </div>
        <Section page={pages[1]} id="contact" />
      </div>
      
      

    </div>
  );
}

export default Home;
