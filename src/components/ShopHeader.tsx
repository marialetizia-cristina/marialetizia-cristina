import Voice from "../components/Voice";
import SwitchLang from "../components/SwitchLang";
import "../style/Header.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const ShopHeader = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const cartItemCount = useCartStore(state =>
        state.items.reduce((total, item) => total + item.quantity, 0)
    );
    const cartLabel = i18n.language === 'it' ? 'Carrello' : 'Cart';

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
                        <Link to="/cart">
                            {cartLabel}{cartItemCount > 0 ? ` (${cartItemCount})` : ''}
                        </Link>
                    </li>
                    <li style={{ color: '#222', fontWeight: 'bold', cursor: 'not-allowed', opacity: 0.5, textTransform: 'uppercase' }}>
                        {i18n.language === 'it' ? 'PREFERITI' : 'FAVOURITES'}
                    </li>
                    <SwitchLang />
                </ul>
            </nav>
            <div className="divider" />
        </div>
    );
};

export default ShopHeader;
