import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/SwitchLang.css";

const SwitchLang = () => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const normalizedLanguage = i18n.language.startsWith("it") ? "IT" : "EN";
    const nextLanguage = normalizedLanguage === "EN" ? "it" : "en";
    const nextLabel = normalizedLanguage === "EN" ? "IT" : "EN";

    const handleToggle = () => {
        void i18n.changeLanguage(nextLanguage);

        if (location.pathname === "/" || location.pathname === "/en" || location.pathname === "/en/") {
            navigate(nextLanguage === "en" ? "/en/" : "/");
        }
    };

    return (
        <li className="switch-lang" role="none">
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
        </li>
    );
};

export default SwitchLang;
