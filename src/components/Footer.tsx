import Voice from "./Voice"
import '../style/Footer.css'
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const Footer = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <>
            {isHome && (
                <div style={{ textAlign: 'center', marginBottom: 8, fontSize: 12, color: '#000', letterSpacing: 0.5, gap: '2rem', display: 'flex', justifyContent: 'center' }} className="footer-credits">
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
                        <li style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Voice value="MARIALETIZIA CRISTINA" path="/" />
                            <span style={{ color: '#222', marginTop: 2, textAlign: "left" }}>P.IVA 03018010185</span>
                        </li>
                        <Voice value="BACK TO TOP" path="#top" />
                        <Voice value={t("nav.privecyPolicy").toUpperCase()} path="/privacyandpolicy" />
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Footer
