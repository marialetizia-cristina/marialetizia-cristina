import Voice from "./Voice";
import SwitchLang from "./SwitchLang";
import "../style/Header.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";

    return (
        <div className="header">
            <nav>
                <ul>
                    {isHome ? (
                        <Voice value={t("nav.works")} path="#works" />
                    ) : (
                        <li>
                            <button
                                onClick={() => navigate(-1)}
                                className="header-back-btn"
                                style={{ color: '#111', textTransform: 'uppercase' }}
                            >
                                {t("nav.backHome").toUpperCase()}
                            </button>
                        </li>
                    )}
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

//TODO: sistemare dettaglio prodotto
//TODO: sistemare gift art
//TODO: sistemare primary section homepage