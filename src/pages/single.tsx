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
import type { SliderImage } from "../types/media";
import { buildSliderImage, dedupeSliderImages } from "../utils/wpMedia";

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
            const baseLanguage = normalizeLanguage(baseWork.polylang?.lang ?? baseWork.lang);
            const translationsMap = baseWork.polylang?.translations ?? baseWork.translations;

            if (baseLanguage === preferredLanguage) {
                setWork(baseWork);
                setLoading(false);
                return;
            }

            const translationId = resolveTranslationId(translationsMap, preferredLanguage);

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
    const strippedTitle = workTitle.replace(/<[^>]*>/g, "").trim();
    const isCaseStudy = isCaseStudyCategory(work?.categories ?? []);
    const sliderSizes = "(min-width: 1280px) 60vw, (min-width: 768px) 80vw, 100vw";
    const gallerySizes = "(min-width: 768px) 80vw, 100vw";

    const featuredMedia = work?._embedded?.["wp:featuredmedia"]?.[0] ?? null;
    const featuredImage = useMemo(() => {
        return buildSliderImage(featuredMedia, { fallbackAlt: strippedTitle, sizes: sliderSizes });
    }, [featuredMedia, strippedTitle]);

    const featuredSrc = featuredImage?.src ?? null;
    const featuredAlt = featuredImage?.alt ?? (strippedTitle || t("single.featuredAlt"));

    const contentIncludesFeatured = useMemo(() => {
        if (!featuredSrc) return false;
        return contentHtml.includes(featuredSrc);
    }, [contentHtml, featuredSrc]);

    const attachmentImages = useMemo(() => {
        if (!work) return [] as SliderImage[];

        const attachments = work._embedded?.["wp:attachment"] ?? [];
        const built = attachments
            .map(media => buildSliderImage(media, { fallbackAlt: strippedTitle, sizes: gallerySizes }))
            .filter((image): image is SliderImage => Boolean(image));

        return dedupeSliderImages(built);
    }, [work, strippedTitle]);

    const additionalImages = useMemo(() => {
        if (attachmentImages.length === 0) {
            return [] as SliderImage[];
        }

        const filtered = attachmentImages.filter(image => {
            const src = image.src;
            if (!src) {
                return false;
            }

            if (featuredSrc && src === featuredSrc) {
                return false;
            }

            if (contentHtml.includes(src)) {
                return false;
            }

            return true;
        });

        return dedupeSliderImages(filtered);
    }, [attachmentImages, featuredSrc, contentHtml]);

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
                        <img
                            src={featuredImage.src}
                            srcSet={featuredImage.srcSet}
                            sizes={featuredImage.sizes}
                            alt={featuredAlt}
                            loading="eager"
                            decoding="async"
                        />
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