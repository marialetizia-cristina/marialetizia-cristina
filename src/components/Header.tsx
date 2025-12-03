import Voice from "./Voice";
import SwitchLang from "./SwitchLang";
import "../style/Header.css";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t } = useTranslation();

    return (
        <div className="header">
            <nav>
                <ul>
                    <Voice value={t("nav.works")} path="#works" />
                    <Voice value={t("nav.about")} path="#about" />
                    <Voice value={t("nav.services")} path="#services" />
                    <Voice value={t("nav.contact")} path="#contact" />
                    <SwitchLang />
                </ul>
            </nav>
            <hr className="divider" />
        </div>
    );
};

export default Header;