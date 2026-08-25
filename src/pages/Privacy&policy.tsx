import "../style/PrivacyAndPolicy.css";
import { useEffect, useState } from "react";
import { fetchPages } from "../api/api";

const PrivacyAndPolicy = () => {
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        <div className="privacy-and-policy">
            <h1 className="privacy-and-policy__title">{title || "Privacy & Policy"}</h1>
            <div className="privacy-and-policy__content">
                {loading && <div>Caricamento...</div>}
                {error && <div style={{color: 'red'}}>{error}</div>}
                {!loading && !error && (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                )}
            </div>
        </div>
    );
};

export default PrivacyAndPolicy;
