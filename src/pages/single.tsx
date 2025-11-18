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

    const galleryImages = useMemo(() => {
        if (!work) return [] as string[];

        const featured = work._embedded?.["wp:featuredmedia"]?.map(img => img.source_url) ?? [];
        const attachments = work._embedded?.["wp:attachment"]?.map(img => img.source_url) ?? [];
        return [...featured, ...attachments].filter((url, index, arr) => url && arr.indexOf(url) === index);
    }, [work]);

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
                <p className="single__error">{error}</p>
                <Link className="single__back" to={backPath}>&larr; {backLabel}</Link>
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
            </header>

            {galleryImages.length > 0 && (
                <div className="single__media">
                    <ImageSlider images={galleryImages} />
                </div>
            )}

            <article
                className="single__content"
                dangerouslySetInnerHTML={{ __html: work.content.rendered }}
            />
        </div>
    );
};

export default SinglePage;