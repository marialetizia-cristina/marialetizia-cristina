import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import { fetchWorkById, type Work } from "../api/api";
import "../style/Single.css";
import LoadingState from "../components/LoadingState";
import { useTranslation } from "react-i18next";
import CaseStudyContent from "../components/CaseStudyContent";

const SinglePage = () => {
    const { workId } = useParams<{ workId: string }>();
    const [work, setWork] = useState<Work | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorKey, setErrorKey] = useState<"noSelection" | "invalidId" | "notFound" | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!workId) {
            setErrorKey("noSelection");
            setLoading(false);
            return;
        }

        const parsedId = Number.parseInt(workId, 10);
        if (Number.isNaN(parsedId)) {
            setErrorKey("invalidId");
            setLoading(false);
            return;
        }

        (async () => {
            setLoading(true);
            const result = await fetchWorkById(parsedId);
            if (!result) {
                setErrorKey("notFound");
            } else {
                setWork(result);
                setErrorKey(null);
            }
            setLoading(false);
        })();
    }, [workId]);

    const contentHtml = work?.content?.rendered ?? "";
    const workTitle = work?.title?.rendered ?? "";
    const isCaseStudy = work?.categories?.includes(15) ?? false;

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