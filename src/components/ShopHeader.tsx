import Voice from "../components/Voice";
import SwitchLang from "../components/SwitchLang";
import "../style/Header.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const ShopHeader = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="header">
            <nav>
                <ul>
                    <li>
                        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', color: '#222', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', textTransform: 'uppercase' }}>
                            {i18n.language === 'it' ? 'INDIETRO' : 'BACK'}
                        </button>
                    </li>
                    <Voice value={t("nav.products")} path="/products" />
                    <li>
                        <Link to="/cart">{i18n.language === 'it' ? 'Carrello' : 'Cart'}</Link>
                    </li>
                    {/* <li style={{ color: '#aaa' }}>|</li> */}
                    <li style={{ color: '#222', fontWeight: 'bold', cursor: 'not-allowed', opacity: 0.5, textTransform: 'uppercase' }}>
                        {i18n.language === 'it' ? 'PREFERITI' : 'FAVOURITES'}
                    </li>
                    <SwitchLang />
                </ul>
            </nav>
            <hr className="divider" />
        </div>
    );
};

export default ShopHeader;
