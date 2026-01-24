import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Voice from "./Voice";
import SwitchLang from "./SwitchLang";
import "../style/Header.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const getIsMobile = () =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

const Header = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => getIsMobile());
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
            {isHome ? (
                <Voice value={t("nav.works")} path="#works" onClick={onItemClick} />
            ) : (
                <li>
                    <button
                        onClick={() => {
                            navigate(-1);
                            onItemClick?.();
                        }}
                        className="header-back-btn"
                        style={{ color: "#111", textTransform: "uppercase" }}
                    >
                        {t("nav.backHome").toUpperCase()}
                    </button>
                </li>
            )}
            <Voice value={t("nav.about")} path="#about" onClick={onItemClick} />
            <Voice value={t("nav.services")} path="#services" onClick={onItemClick} />
            <Voice value={t("nav.contact")} path="#contact" onClick={onItemClick} />
            <Voice value={t("nav.products")} path="products" onClick={onItemClick} />
            <li className="switch-lang-wrapper">
                <SwitchLang />
            </li>
        </>
    );

    return (
        <div className="header">
            <div className="header-content">
                {isMobile ? (
                    <button
                        className={`hamburger-toggle ${isMenuOpen ? "active" : ""}`}
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle menu"
                        type="button"
                    >
                        {isMenuOpen ? (
                            <FiX
                                className="hamburger-icon"
                                aria-hidden="true"
                                size={ICON_SIZE}
                                strokeWidth={1.75}
                            />
                        ) : (
                            <FiMenu
                                className="hamburger-icon"
                                aria-hidden="true"
                                size={ICON_SIZE}
                                strokeWidth={1.75}
                            />
                        )}
                    </button>
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