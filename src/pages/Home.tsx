import { use, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../utils/language";
import type { Page } from "../api/api";
import { useContentStore } from "../store/useContentStore";

import '../style/Home.css';
import WorksGrid from '../components/WorksGrid';
import Title from '../components/Title';
import Profession from '../components/Profession';
import CategoryContainer from '../components/CategoryContainer';
import Section from '../components/Section';
import LoadingState from "../components/LoadingState";

const Home = () => {
  const pages = useContentStore(state => state.pages);
  const pagesLoaded = useContentStore(state => state.pagesLoaded);
  const pagesLoading = useContentStore(state => state.pagesLoading);
  const loadPages = useContentStore(state => state.loadPages);
  const location = useLocation();
  const { hash } = location;
  const { t, i18n } = useTranslation();
  const preferredLanguage = normalizeLanguage(i18n.language) || "it";
  const isFirstRender = useRef(true);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const { lookupBySlugs, lookupByKeywords } = useMemo(() => {
    const pagesById = new Map<number, Page>();
    const pagesBySlug = new Map<string, Page>();

    pages.forEach((page) => {
      pagesById.set(page.id, page);
      pagesBySlug.set(page.slug.toLowerCase(), page);
    });

    const pickLocalizedVariant = (page?: Page): Page | undefined => {
      if (!page) {
        return undefined;
      }

      const pageLanguage = normalizeLanguage(page.polylang?.lang);

      if (pageLanguage === preferredLanguage) {
        return page;
      }

      const translationId = page.polylang?.translations?.[preferredLanguage];
      if (translationId) {
        const translated = pagesById.get(translationId);
        if (translated) {
          return translated;
        }
      }

      if (!pageLanguage) {
        return page;
      }

      return page;
    };

    const lookupBySlugs = (slugs: string[]) => {
      for (const rawSlug of slugs) {
        const slug = rawSlug.toLowerCase();
        const candidate = pagesBySlug.get(slug);
        const localized = pickLocalizedVariant(candidate);
        if (localized) {
          return localized;
        }
      }
      return undefined;
    };

    const lookupByKeywords = (keywords: string[]) => {
      const lowered = keywords.map((keyword) => keyword.toLowerCase());
      const candidate = pages.find((page) => {
        const title = page.title.rendered.toLowerCase();
        return lowered.some((keyword) => title.includes(keyword));
      });

      return pickLocalizedVariant(candidate);
    };

    return { lookupBySlugs, lookupByKeywords };
  }, [pages, preferredLanguage]);

  const aboutPage = useMemo(() => {
    return (
      lookupBySlugs(["about-me", "about", "chi-sono"]) ??
      lookupByKeywords(["about", "chi sono", "bio"])
    );
  }, [lookupBySlugs, lookupByKeywords]);

  const servicesPage = useMemo(() => {
    return (
      lookupBySlugs(["services", "servizi", "service"]) ??
      lookupByKeywords(["services", "servizi", "service"])
    );
  }, [lookupBySlugs, lookupByKeywords]);

  const contactPage = useMemo(() => {
    return (
      lookupBySlugs(["contact", "contatti", "contacts"]) ??
      lookupByKeywords(["contact", "contatti", "contacts"])
    );
  }, [lookupBySlugs, lookupByKeywords]);

  const firstSection = useMemo(() => {
    return (
      lookupBySlugs(["home-intro", "home-introduction", "introduzione", "first-section"]) ??
      lookupByKeywords(["introduction", "introduzione", "welcome", "benvenuto"])
    );
  }, [lookupBySlugs, lookupByKeywords]);

  const loading = !pagesLoaded && (pagesLoading || pages.length === 0);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector(hash);
    if (target instanceof HTMLElement) {
      const header = document.querySelector(".header");
      const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 0;
      const offset = Math.max(headerHeight + 16, 0);
      const targetTop = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(targetTop - offset, 0),
        behavior: "smooth",
      });
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
      <Section page={firstSection} id="first-section" />
      <CategoryContainer />

      <div className='works' id="works">
        <WorksGrid limits={20} category="FEATURED" returnPath="/" showSeeAll />
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
