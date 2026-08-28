import "../style/PrivacyAndPolicy.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchPages } from "../api/api";
import { normalizeLanguage, resolveTranslationId } from "../utils/language";
import { usePageMeta } from "../utils/usePageMeta";

const PrivacyAndPolicy = () => {
    const { t, i18n } = useTranslation();
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    usePageMeta(title || t("privacyPage.title"), t("privacyPage.description"), "/privacyandpolicy");

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError(null);
            setContent("");
            setTitle("");
            try {
                const pages = await fetchPages();
                const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language) || "it";
                const privacyPage = pages.find(page =>
                    page.slug === "privacy-policy" || page.slug === "privacy" || page.slug.includes("privacy")
                );
                const translationId = resolveTranslationId(
                    privacyPage?.polylang?.translations ?? privacyPage?.translations,
                    language
                );
                const page = pages.find(candidate => candidate.id === translationId)
                    ?? pages.find(candidate =>
                        normalizeLanguage(candidate.polylang?.lang ?? candidate.lang) === language
                        && (candidate.slug === "privacy-policy" || candidate.slug === "privacy" || candidate.slug.includes("privacy"))
                    );

                if (!active) return;

                if (page) {
                    setTitle(page.title.rendered);
                    setContent(page.content.rendered);
                } else {
                    setError(t("privacyPage.notFound"));
                }
            } catch (e: unknown) {
                if (active) setError(e instanceof Error ? e.message : t("privacyPage.loadError"));
            } finally {
                if (active) setLoading(false);
            }
        };
        void load();

        return () => {
            active = false;
        };
    }, [i18n.language, i18n.resolvedLanguage, t]);

    return (
        <section className="privacy-and-policy">
            <h1 className="privacy-and-policy__title">{title || t("privacyPage.title")}</h1>
            <div className="privacy-and-policy__content">
                {loading && <p className="privacy-and-policy__message" role="status">{t("privacyPage.loading")}</p>}
                {error && <p className="privacy-and-policy__message privacy-and-policy__message--error" role="alert">{error}</p>}
                {!loading && !error && (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                )}
            </div>
        </section>
    );
};

export default PrivacyAndPolicy;
