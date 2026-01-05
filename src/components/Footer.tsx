import Voice from "./Voice"
import '../style/Footer.css'
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <div className="footer">
            <hr className="divider" />
            <nav>
                <ul>
                    <Voice value="MARIALETIZIA CRISTINA" path="/" />
                    <Voice value="BACK TO TOP" path="#top" />
                    <Voice value={t("nav.privecyPolicy").toUpperCase()} path="/privacyandpolicy" />
                </ul>
            </nav>
        </div>
    )
}

export default Footer