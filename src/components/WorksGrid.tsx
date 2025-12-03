import { useEffect, useMemo, useRef, useState } from "react";
import { fetchWorks, type Work } from "../api/api";
import WorkCard from "./WorkCard";
import "../style/WorksGrid.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageCategoryId } from "../utils/languagePreference";

interface WorksGridProps {
  category?: "ALL" | "GRAPHIC DESIGN" | "ILLUSTRATIONS" | "FEATURED";
  limits?: number;
  returnPath?: string;
}

const WorksGrid = ({ category = "ALL", limits, returnPath = "/category/all" }: WorksGridProps) => {
  //const [works, setWorks] = useState<Work[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([]);
  const [seeAllHeight, setSeeAllHeight] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { t, i18n } = useTranslation();
  const seeMoreLines = useMemo(() => {
    const lines = t("works.seeMoreLines", { returnObjects: true }) as unknown;
    if (Array.isArray(lines)) {
      return lines as string[];
    }
    return [String(lines ?? "SEE MORE")];
  }, [t]);

  useEffect(() => {
    fetchWorks().then(data => {
      const languageCategoryId = getLanguageCategoryId(i18n.language);

      const byLanguage = data.filter(work => {
        if (!languageCategoryId) {
          return true;
        }
        return work.categories?.includes(languageCategoryId) ?? false;
      });

      if (category === "ALL") {
        setFilteredWorks(byLanguage);
      } else {
        const categoryId = getCategoryId(category);
        setFilteredWorks(
          byLanguage.filter(work =>
            categoryId ? work.categories?.includes(categoryId) : true
          )
        );
      }
    });
  }, [category, i18n.language]);

  // Funzione per mappare i nomi categoria agli ID di WP
  const getCategoryId = (cat: string): number => {
    switch (cat) {
      case "GRAPHIC DESIGN":
        return 13; // sostituire con l'ID reale di GRAPHIC DESIGN
      case "ILLUSTRATIONS":
        return 4; // sostituire con l'ID reale di ILLUSTRATIONS
      case "FEATURED":
        return 14; // sostituire con l'ID reale di FEATURED      
      default:
        return 0;
    }
  };

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) {
      setSeeAllHeight(null);
      return;
    }

    const firstCard = gridElement.querySelector<HTMLElement>(".masonry-item:not(.works-grid__see-all)");

    if (!firstCard) {
      setSeeAllHeight(null);
      return;
    }

    const updateSize = () => {
      const height = firstCard.getBoundingClientRect().height;
      if (height && Math.abs(height - (seeAllHeight ?? 0)) > 0.5) {
        setSeeAllHeight(height);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(firstCard);

    window.addEventListener("resize", updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [filteredWorks, seeAllHeight]);

  return (
    <div className="works-grid" ref={gridRef}>
      {filteredWorks.length > 0 ? (
        <>
          {(limits ? filteredWorks.slice(0, limits) : filteredWorks).map(work => (
            <WorkCard key={work.id} work={work} returnPath={returnPath} />
          ))}
          <div className="masonry-item works-grid__see-all">
            <Link
              className="works-grid__see-all-link"
              to="/category/all"
              style={seeAllHeight ? { height: `${seeAllHeight}px` } : undefined}
            >
              <span
                dangerouslySetInnerHTML={{ __html: seeMoreLines.join("<br />") }}
              />
            </Link>
          </div>
        </>

      ) : (
        <p>{t("works.empty")}</p>
      )}
    </div>
  );

};

export default WorksGrid;
