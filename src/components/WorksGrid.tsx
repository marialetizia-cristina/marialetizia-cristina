import { useEffect, useMemo, useState } from "react";
import type { Work } from "../api/api";
import WorkCard from "./WorkCard";
import "../style/WorksGrid.css";
import { useTranslation } from "react-i18next";
import { coerceNumericId, normalizeLanguage } from "../utils/language";
import { Link } from "react-router-dom";
import { useContentStore } from "../store/useContentStore";

interface WorksGridProps {
  category?: "ALL" | "GRAPHIC DESIGN" | "ILLUSTRATIONS" | "FEATURED";
  limits?: number;
  returnPath?: string;
  showSeeAll?: boolean;
}

type WorksGridCategory = NonNullable<WorksGridProps["category"]>;

const CATEGORY_ID_MAP: Record<WorksGridCategory, number[]> = {
  ALL: [],
  "GRAPHIC DESIGN": [13 /* EN */, 62 /* IT */],
  "ILLUSTRATIONS": [4 /* EN */, 66 /* IT */],
  "FEATURED": [14 /* EN */, 60 /* IT */],
};

const WorksGrid = ({
  category = "ALL",
  limits,
  returnPath = "/category/all",
  showSeeAll = false,
}: WorksGridProps) => {
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const works = useContentStore(state => state.works);
  const worksLoaded = useContentStore(state => state.worksLoaded);
  const worksLoading = useContentStore(state => state.worksLoading);
  const loadWorks = useContentStore(state => state.loadWorks);
  const { t, i18n } = useTranslation();
  const seeMoreLines = useMemo(() => {
    const lines = t("works.seeMoreLines", { returnObjects: true }) as unknown;
    if (Array.isArray(lines)) {
      return lines as string[];
    }
    return [String(lines ?? "SEE MORE")];
  }, [t]);

  useEffect(() => {
    void loadWorks();
  }, [loadWorks]);

  // Funzione per mappare i nomi categoria agli ID di WP
  const getCategoryIds = (cat: WorksGridCategory): number[] => {
    return CATEGORY_ID_MAP[cat] ?? [];
  };

  const filteredWorks = useMemo(() => {
    if (!works.length) {
      return [];
    }

    const preferredLanguage = normalizeLanguage(i18n.language) || "it";

    type WorkGroup = {
      fallback: Work;
      variants: Map<string, Work>;
      categoryIds: Set<number>;
    };

    const groups = new Map<string, WorkGroup>();
    const order: string[] = [];

    works.forEach(work => {
      const idSet = new Set<number>();
      idSet.add(work.id);

      const translationValues = work.polylang?.translations;
      if (translationValues) {
        Object.values(translationValues).forEach(value => {
          const numericId = coerceNumericId(value);
          if (numericId !== undefined) {
            idSet.add(numericId);
          }
        });
      }

      const key = `poly:${Array.from(idSet).sort((a, b) => a - b).join(":")}`;
      const langCode = normalizeLanguage(work.polylang?.lang);
      const categories = work.categories ?? [];

      if (!groups.has(key)) {
        const variants = new Map<string, Work>();
        if (langCode) {
          variants.set(langCode, work);
        }

        const categoryIds = new Set<number>();
        categories.forEach(id => categoryIds.add(id));

        groups.set(key, {
          fallback: work,
          variants,
          categoryIds,
        });
        order.push(key);
      } else {
        const group = groups.get(key)!;
        if (langCode && !group.variants.has(langCode)) {
          group.variants.set(langCode, work);
        }
        categories.forEach(id => group.categoryIds.add(id));
      }
    });

    const categoryIds = getCategoryIds(category).filter(id => Number.isFinite(id) && id > 0);
    const results: Work[] = [];
    const seenIds = new Set<number>();

    order.forEach(key => {
      const group = groups.get(key);
      if (!group) {
        return;
      }

      const preferredWork = group.variants.get(preferredLanguage);
      const candidate = preferredWork ?? group.fallback;
      if (!candidate) {
        return;
      }

      if (seenIds.has(candidate.id)) {
        return;
      }

      if (category !== "ALL" && categoryIds.length > 0) {
        const categoryMatches = new Set<number>();
        (candidate.categories ?? []).forEach(id => categoryMatches.add(id));
        group.categoryIds.forEach(id => categoryMatches.add(id));

        const hasMatch = categoryIds.some(id => categoryMatches.has(id));
        if (!hasMatch) {
          return;
        }
      }

      results.push(candidate);
      seenIds.add(candidate.id);
    });

    return results;
  }, [works, i18n.language, category]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const isLoading = !worksLoaded && worksLoading;

    if (!isLoading && filteredWorks.length === 0) {
      timeoutId = setTimeout(() => {
        setShowEmptyMessage(true);
      }, 1500);
    } else {
      setShowEmptyMessage(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [worksLoaded, worksLoading, filteredWorks.length]);

  const isLoading = !worksLoaded && worksLoading;

  return (
    <div className="works-grid">
      {filteredWorks.length > 0 ? (
        <>
          {(limits ? filteredWorks.slice(0, limits) : filteredWorks).map(work => (
            <WorkCard key={work.id} work={work} returnPath={returnPath} />
          ))}
          {showSeeAll && (
            <div className="masonry-item works-grid__see-all">
              <Link
                className="works-grid__see-all-link"
                to="/category/all"
              >
                <span dangerouslySetInnerHTML={{ __html: seeMoreLines.join("<br />") }} />
              </Link>
            </div>
          )}
        </>
      ) : (
        <>
          {isLoading && <p className="works-grid__loading">{t("loaders.preparingPortfolio")}</p>}
          {!isLoading && showEmptyMessage && <p>{t("works.empty")}</p>}
        </>
      )}
    </div>
  );

};

export default WorksGrid;
