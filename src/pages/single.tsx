import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import { fetchWorkById, type Work } from "../api/api";
import "../style/Single.css";

const SinglePage = () => {
    const { workId } = useParams<{ workId: string }>();
    const location = useLocation();
    const [work, setWork] = useState<Work | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!workId) {
            setError("No work selected.");
            setLoading(false);
            return;
        }

        const parsedId = Number.parseInt(workId, 10);
        if (Number.isNaN(parsedId)) {
            setError("Invalid work identifier.");
            setLoading(false);
            return;
        }

        (async () => {
            setLoading(true);
            const result = await fetchWorkById(parsedId);
            if (!result) {
                setError("Unable to find the requested work.");
            } else {
                setWork(result);
                setError(null);
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

    const featuredAlt = useMemo(() => {
        const stripped = workTitle.replace(/<[^>]*>/g, "").trim();
        return stripped || "Featured image";
    }, [workTitle]);

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

    const { backPath, backLabel } = useMemo(() => {
        const fromState = (location.state as { from?: string } | undefined)?.from;

        switch (fromState) {
            case "/":
                return { backPath: "/", backLabel: "Back to Home" };
            case "/category/all":
                return { backPath: "/category/all", backLabel: "Back to Works" };
            case "/category/graphic-design":
                return { backPath: "/category/graphic-design", backLabel: "Back to Graphic Design" };
            case "/category/illustrations":
                return { backPath: "/category/illustrations", backLabel: "Back to Illustrations" };
            default:
                if (typeof fromState === "string") {
                    return { backPath: fromState, backLabel: "Back to previous page" };
                }
                return { backPath: "/category/all", backLabel: "Back to Works" };
        }
    }, [location.state]);

    if (loading) {
        return <div className="single container">Loading...</div>;
    }

    if (error) {
        return (
            <div className="single container">
                <Link className="single__back" to={backPath}>&larr; {backLabel}</Link>
                <p className="single__error">{error}</p>
            </div>
        );
    }

    if (!work) {
        return null;
    }

    return (
        <div className="single container">
            <Link className="single__back" to={backPath}>&larr; {backLabel}</Link>

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

            <article
                className={`single__content${isCaseStudy ? " single__content--blocks" : ""}`}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </div>
    );
};

export default SinglePage;