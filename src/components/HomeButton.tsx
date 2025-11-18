import { Link, useLocation } from "react-router-dom";
import "../style/HomeButton.css";

interface HomeButtonProps {
  label?: string;
}

const HomeButton = ({ label = "Back to Home" }: HomeButtonProps) => {
  const location = useLocation();
  const fromState = (location.state as { from?: string } | undefined)?.from;
  const isHome = location.pathname === "/";
  const cameFromHomeToSingle = location.pathname.startsWith("/single") && fromState === "/";

  if (isHome || cameFromHomeToSingle) {
    return null;
  }

  return (
    <Link to="/" className="home-button">
      {label}
    </Link>
  );
};

export default HomeButton;
