import { useTranslation } from "react-i18next";
import "../style/SwitchLang.css";

const SwitchLang = () => {
    const { i18n } = useTranslation();
    const normalizedLanguage = i18n.language.startsWith("it") ? "IT" : "EN";
    const nextLanguage = normalizedLanguage === "EN" ? "it" : "en";
    const nextLabel = normalizedLanguage === "EN" ? "IT" : "EN";

    const handleToggle = () => {
        void i18n.changeLanguage(nextLanguage);
    };

    return (
        <div className="switch-lang">
            <button
                className="switch-lang__button"
                type="button"
                onClick={handleToggle}
                aria-label={
                    normalizedLanguage === "EN"
                        ? "Switch language to Italian"
                        : "Cambia lingua in inglese"
                }
            >
                {nextLabel}
            </button>
        </div>
    );
};

export default SwitchLang;