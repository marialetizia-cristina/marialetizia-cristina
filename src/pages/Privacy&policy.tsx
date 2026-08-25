import "../style/PrivacyAndPolicy.css";
import { useEffect, useState } from "react";
import { fetchPages } from "../api/api";
import { usePageMeta } from "../utils/usePageMeta";

const PrivacyAndPolicy = () => {
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    usePageMeta(title || "Privacy & Policy", "Informazioni sul trattamento dei dati e sulle politiche del sito.", "/privacyandpolicy");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const pages = await fetchPages();
                // Cerca la pagina privacy per slug (modifica qui se slug diverso)
                const page = pages.find(p => p.slug === "privacy-policy" || p.slug === "privacy" || p.slug.includes("privacy"));
                if (page) {
                    setTitle(page.title.rendered);
                    setContent(page.content.rendered);
                } else {
                    setError("Pagina privacy non trovata.");
                }
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Errore caricamento pagina.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <section className="privacy-and-policy">
            <h1 className="privacy-and-policy__title">{title || "Privacy & Policy"}</h1>
            <div className="privacy-and-policy__content">
                {loading && <p className="privacy-and-policy__message" role="status">Caricamento...</p>}
                {error && <p className="privacy-and-policy__message privacy-and-policy__message--error" role="alert">{error}</p>}
                {!loading && !error && (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                )}
            </div>
        </section>
    );
};

export default PrivacyAndPolicy;
