import Voice from "./Voice"
import '../style/Footer.css'
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === "/" || location.pathname === "/en" || location.pathname === "/en/";

    return (
        <>
            {isHome && (
                <div className="footer-credits">
                    <span>
                        {t("credits.designLabel")}: <a className="footer-credits__link" href="#">Marialetizia Cristina</a>
                    </span>
                    <span>
                        {t("credits.devLabel")}: <a className="footer-credits__link" href="https://niccolomaffioli.dev" target="_blank" rel="noreferrer">Niccolò Maffioli</a>
                    </span>
                </div>
            )}
            <div className="footer">
                <div className="divider" />
                <nav>
                    <ul>
                        <li className="footer__identity">
                            <Link to="/">MARIALETIZIA CRISTINA</Link>
                            <span className="footer__vat">P.IVA 03018010185</span>
                        </li>
                        <li>
                            <a href="#top">{t("nav.backTop").toUpperCase()}</a>
                        </li>
                        <Voice value={t("nav.privecyPolicy").toUpperCase()} path="/privacyandpolicy" />
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Footer
