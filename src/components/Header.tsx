import Voice from "./Voice";
import SwitchLang from "./SwitchLang";
import "../style/Header.css";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="header">
            <nav>
                <ul>
                    <Voice value={t(isHome ? "nav.works" : "nav.home")} path={isHome ? "#works" : "/"} />
                    <Voice value={t("nav.about")} path="#about" />
                    <Voice value={t("nav.services")} path="#services" />
                    <Voice value={t("nav.contact")} path="#contact" />
                    <Voice value={t("nav.products")} path="products" />
                    <SwitchLang />
                </ul>
            </nav>
            <hr className="divider" />
        </div>
    );
};

export default Header;