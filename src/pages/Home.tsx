import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPages } from "../api/api";
import type { Page } from "../api/api";

import '../style/Home.css';
import WorksGrid from '../components/WorksGrid';
import Title from '../components/Title';
import Profession from '../components/Profession';
import CategoryContainer from '../components/CategoryContainer';
import Section from '../components/Section';
import LoadingState from "../components/LoadingState";

const Home = () => {

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { hash } = location;
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const result = await fetchPages();
      setPages(result);
      setLoading(false);
    })();
  }, []);

  const findBySlug = useMemo(() => {
    const map = new Map<string, Page>();
    pages.forEach((page) => {
      map.set(page.slug.toLowerCase(), page);
    });
    return (slugs: string[]) => {
      for (const slug of slugs) {
        const match = map.get(slug);
        if (match) return match;
      }
      return undefined;
    };
  }, [pages]);

  const findByTitleKeyword = useMemo(() => {
    return (keywords: string[]) => {
      const lowerKeywords = keywords.map((keyword) => keyword.toLowerCase());
      return pages.find((page) => {
        const title = page.title.rendered.toLowerCase();
        return lowerKeywords.some((keyword) => title.includes(keyword));
      });
    };
  }, [pages]);

  const aboutPage = useMemo(() => {
    return (
      findBySlug(["about-me", "about", "chi-sono"]) ??
      findByTitleKeyword(["about", "chi sono", "bio"])
    );
  }, [findBySlug, findByTitleKeyword]);

  const servicesPage = useMemo(() => {
    return (
      findBySlug(["services", "servizi", "service"]) ??
      findByTitleKeyword(["services", "servizi", "service"])
    );
  }, [findBySlug, findByTitleKeyword]);

  const contactPage = useMemo(() => {
    return (
      findBySlug(["contact", "contatti", "contacts"]) ??
      findByTitleKeyword(["contact", "contatti", "contacts"])
    );
  }, [findBySlug, findByTitleKeyword]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!hash) {
      return;
    }

    const target = document.querySelector(hash);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, hash]);

  if (loading) {
    return <LoadingState message={t("loaders.preparingPortfolio")} />;
  }

  return (
    <div className='home'>
      <div className="hero">
        <Title text="MARIALETIZIA CRISTINA" />
        <Profession name={t("hero.subtitle").toUpperCase()} />
      </div>
      {/* <Section page={pages[0]} id="first-section" /> */}
      <CategoryContainer />

      <div className='works' id="works">
        <WorksGrid limits={20} category="FEATURED" returnPath="/" />
      </div>

      <div className="about-container">
        <div className="title-container">
          <hr className='divider' />
          <Title text={t("sections.about")} />
          <hr className='divider' />
        </div>
        {aboutPage && <Section page={aboutPage} id="about" />}
      </div>

      <div className="services-container">
        <div className="title-container">
          <hr className='divider' />
          <Title text={t("sections.services")} />
          <hr className='divider' />
        </div>
        {servicesPage && <Section page={servicesPage} id="services" />}
      </div>

      <div className="contact-container">
        <div className="title-container">
          <hr className='divider' />
          <Title text={t("sections.contact")} />
          <hr className='divider' />
        </div>
        {contactPage && <Section page={contactPage} id="contact" />}
      </div>
      
      

    </div>
  );
}

export default Home;
