import { useEffect, useState } from "react";
import { FiMenu, FiShoppingBag, FiX } from "react-icons/fi";
import Voice from "./Voice";
import SwitchLang from "./SwitchLang";
import "../style/Header.css";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const getIsMobile = () =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

const Header = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === "/";
    const isShop = location.pathname.startsWith("/products")
        || location.pathname.startsWith("/cart")
        || location.pathname.startsWith("/checkout")
        || location.pathname.startsWith("/account")
        || location.pathname.startsWith("/favorites")
        || location.pathname.startsWith("/request/custom-gift");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => getIsMobile());
    const cart = useCartStore((state) => state.cart);
    const loadCart = useCartStore((state) => state.loadCart);
    const cartCount = cart?.items_count ?? 0;
    const ICON_SIZE = 32;

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const handleResize = () => {
            const mobile = getIsMobile();
            setIsMobile(mobile);
            if (!mobile) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => { void loadCart(); }, [loadCart]);

    useEffect(() => {
        if (!isMobile || typeof document === "undefined") {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = isMenuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMenuOpen, isMobile]);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);
    //const iconSize = isMenuOpen ? 30 : 30;

    const renderNavItems = (onItemClick?: () => void) => (
        <>
            {isShop ? (
                <>
                    <Voice value={t("nav.portfolio")} path="/" onClick={onItemClick} />
                    <Voice value={t("nav.products")} path="/products" onClick={onItemClick} />
                    <li className="header-cart-item">
                        <Link to="/cart" onClick={onItemClick} aria-label={t("nav.cartWithCount", { count: cartCount })}>
                            {t("nav.cart")}
                            <span className="header-cart-count" aria-hidden="true">{cartCount}</span>
                        </Link>
                    </li>
                    <Voice value={t("nav.favorites")} path="/favorites" onClick={onItemClick} />
                    <Voice value={t("nav.account")} path="/account" onClick={onItemClick} />
                    <li className="switch-lang-wrapper">
                        <SwitchLang />
                    </li>
                </>
            ) : isHome ? (
                <Voice value={t("nav.works")} path="#works" onClick={onItemClick} />
            ) : (
                <li>
                    <Link to="/" onClick={onItemClick} className="header-back-btn">
                        {t("nav.backHome").toUpperCase()}
                    </Link>
                </li>
            )}
            {!isShop && (
                <>
                    <Voice value={t("nav.about")} path="#about" onClick={onItemClick} />
                    <Voice value={t("nav.services")} path="#services" onClick={onItemClick} />
                    <Voice value={t("nav.contact")} path="#contact" onClick={onItemClick} />
                    <Voice value={t("nav.ecommerce")} path="/products" onClick={onItemClick} />
                    <li className="switch-lang-wrapper">
                        <SwitchLang />
                    </li>
                </>
            )}
        </>
    );

    return (
        <div className="header">
            <div className="header-content">
                {isMobile ? (
                    <div className="header-mobile-actions">
                        {isShop && (
                            <Link className="header-cart-shortcut" to="/cart" aria-label={t("nav.cartWithCount", { count: cartCount })}>
                                <FiShoppingBag aria-hidden="true" size={24} />
                                <span>{cartCount}</span>
                            </Link>
                        )}
                        <button
                            className={`hamburger-toggle ${isMenuOpen ? "active" : ""}`}
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-label={t("nav.toggleMenu")}
                            type="button"
                        >
                            {isMenuOpen ? <FiX className="hamburger-icon" aria-hidden="true" size={ICON_SIZE} strokeWidth={1.75} /> : <FiMenu className="hamburger-icon" aria-hidden="true" size={ICON_SIZE} strokeWidth={1.75} />}
                        </button>
                    </div>
                ) : (
                    <nav className="header-nav">
                        <ul>{renderNavItems()}</ul>
                    </nav>
                )}
            </div>
            <div className="divider" />
            {isMobile && (
                <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                    <button
                        className="mobile-menu-close"
                        onClick={closeMenu}
                        aria-label="Close menu"
                        type="button"
                    >
                        <FiX
                            className="mobile-menu-close-icon"
                            aria-hidden="true"
                            size={ICON_SIZE}
                            strokeWidth={1.75}
                        />
                    </button>
                    <nav>
                        <ul>{renderNavItems(closeMenu)}</ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Header;

//TODO: sistemare dettaglio prodotto
//TODO: sistemare gift art
//TODO: sistemare primary section homepage
