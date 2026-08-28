import { Link, useLocation } from "react-router-dom";
import "../style/Voice.css";

interface VoiceProps {
  value: string;
  path: string;
  onClick?: () => void;
}

const Voice = ({ value, path, onClick }: VoiceProps) => {
  const location = useLocation();
  const isHashLink = path.startsWith("#");
  const isHome = location.pathname === "/" || location.pathname === "/en" || location.pathname === "/en/";

  if (!isHashLink) {
    return (
      <li>
        <Link to={path} onClick={onClick}>
          {value}
        </Link>
      </li>
    );
  }

  const hashTarget = path;
  const to = isHome
    ? { pathname: location.pathname, hash: hashTarget }
    : { pathname: "/", hash: hashTarget };

  return (
    <li>
      <Link to={to} onClick={onClick}>
        {value}
      </Link>
    </li>
  );
};

export default Voice;
