import { Link, useLocation } from "react-router-dom";
import "../style/HomeButton.css";

interface HomeButtonProps {
  label?: string;
}

const HomeButton = ({ label = "Back to Home" }: HomeButtonProps) => {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <Link to="/" className="home-button">
      {label}
    </Link>
  );
};

export default HomeButton;
