import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import { fetchWorkById, type Work } from "../api/api";
import "../style/Single.css";
import LoadingState from "../components/LoadingState";
import { useTranslation } from "react-i18next";
import CaseStudyContent from "../components/CaseStudyContent";
import { normalizeLanguage, resolveTranslationId } from "../utils/language";
import { isCaseStudyCategory } from "../utils/categories";
import { useContentStore } from "../store/useContentStore";

const SinglePage = () => {
    const { workId } = useParams<{ workId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const fromState = (location.state as { from?: string } | undefined)?.from;
    const [work, setWork] = useState<Work | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorKey, setErrorKey] = useState<"noSelection" | "invalidId" | "notFound" | null>(null);
    const { t, i18n } = useTranslation();
    const getWorkById = useContentStore(state => state.getWorkById);
    const upsertWork = useContentStore(state => state.upsertWork);
    const loadWorks = useContentStore(state => state.loadWorks);
    const worksLoaded = useContentStore(state => state.worksLoaded);
    const worksLoading = useContentStore(state => state.worksLoading);

    useEffect(() => {
        if (!worksLoaded && !worksLoading) {
            void loadWorks();
        }
    }, [worksLoaded, worksLoading, loadWorks]);

    useEffect(() => {
        if (!workId) {
            setWork(null);
            setErrorKey("noSelection");
            setLoading(false);
            return;
        }

        const parsedId = Number.parseInt(workId, 10);
        if (Number.isNaN(parsedId)) {
            setWork(null);
            setErrorKey("invalidId");
            setLoading(false);
            return;
        }

        let isCancelled = false;

        const resolveWork = async (): Promise<void> => {
            setLoading(true);
            setErrorKey(null);

            let baseWork = getWorkById(parsedId) ?? null;

            if (!baseWork) {
                baseWork = await fetchWorkById(parsedId);
                if (!isCancelled && baseWork) {
                    upsertWork(baseWork);
                }
            }

            if (isCancelled) {
                return;
            }

            if (!baseWork) {
                setWork(null);
                setErrorKey("notFound");
                setLoading(false);
                return;
            }

            const preferredLanguage = normalizeLanguage(i18n.language) || "it";
            const baseLanguage = normalizeLanguage(baseWork.polylang?.lang);

            if (baseLanguage === preferredLanguage) {
                setWork(baseWork);
                setLoading(false);
                return;
            }

            const translationId = resolveTranslationId(baseWork.polylang?.translations, preferredLanguage);

            if (translationId && translationId !== baseWork.id) {
                const translated = await fetchWorkById(translationId);
                if (isCancelled) {
                    return;
                }

                if (translated) {
                    upsertWork(translated);
                    if (translationId !== parsedId) {
                        navigate(`/single/${translationId}`, {
                            replace: true,
                            state: fromState ? { from: fromState } : undefined,
                        });
                        return;
                    }

                    setWork(translated);
                    setLoading(false);
                    return;
                }
            }

            setWork(baseWork);
            setLoading(false);
        };

        void resolveWork();

        return () => {
            isCancelled = true;
        };
    }, [workId, i18n.language, navigate, fromState, getWorkById, upsertWork]);

    const contentHtml = work?.content?.rendered ?? "";
    const workTitle = work?.title?.rendered ?? "";
    const isCaseStudy = isCaseStudyCategory(work?.categories ?? []);

    const featuredImage = useMemo(() => {
        return work?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
    }, [work]);

    const strippedTitle = workTitle.replace(/<[^>]*>/g, "").trim();
    const featuredAlt = strippedTitle || t("single.featuredAlt");

    const contentIncludesFeatured = useMemo(() => {
        if (!featuredImage) return false;
        return contentHtml.includes(featuredImage);
    }, [contentHtml, featuredImage]);

    const additionalImages = useMemo(() => {
        if (!work) return [] as string[];

        const attachments = work._embedded?.["wp:attachment"]?.map(img => img.source_url) ?? [];
        const merged = [...attachments];

        return merged
            .filter((url): url is string => Boolean(url))
            .filter((url, index, arr) => arr.indexOf(url) === index)
            .filter(url => url !== featuredImage)
            .filter(url => !contentHtml.includes(url));
    }, [work, featuredImage, contentHtml]);

    const errorMessage = errorKey ? t(`single.errors.${errorKey}`) : null;

    if (loading) {
        return <LoadingState className="single container" message={t("loaders.loadingProject")} />;
    }

    if (errorMessage) {
        return (
            <div className="single container">
                <p className="single__error">{errorMessage}</p>
            </div>
        );
    }

    if (!work) {
        return null;
    }

    return (
        <div className="single container">
            <header className="single__header">
                <div className="single__title" dangerouslySetInnerHTML={{ __html: work.title.rendered }} />
                {!isCaseStudy && featuredImage && !contentIncludesFeatured && (
                    <figure className="single__featured">
                        <img src={featuredImage} alt={featuredAlt} />
                    </figure>
                )}
            </header>

            {!isCaseStudy && additionalImages.length > 0 && (
                <div className="single__gallery">
                    <ImageSlider images={additionalImages} autoPlay className="single__gallery-slider" />
                </div>
            )}

            {isCaseStudy ? (
                <CaseStudyContent html={contentHtml} className="single__content single__content--blocks" />
            ) : (
                <article className="single__content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            )}
        </div>
    );
};

export default SinglePage;