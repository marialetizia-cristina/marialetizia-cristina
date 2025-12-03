import { Link, useLocation } from "react-router-dom";
import "../style/HomeButton.css";
import { useTranslation } from "react-i18next";

interface HomeButtonProps {
  label?: string;
}

const HomeButton = ({ label }: HomeButtonProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const fromState = (location.state as { from?: string } | undefined)?.from;
  const isHome = location.pathname === "/";
  const cameFromHomeToSingle = location.pathname.startsWith("/single") && fromState === "/";

  if (isHome || cameFromHomeToSingle) {
    return null;
  }

  return (
    <Link to="/" className="home-button">
      {label ?? t("nav.backHome")}
    </Link>
  );
};

export default HomeButton;
