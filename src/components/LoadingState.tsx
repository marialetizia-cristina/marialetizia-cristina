import "../style/LoadingState.css";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState = ({ message, className }: LoadingStateProps) => {
  const { t } = useTranslation();
  const wrapperClassName = className ? `loading-state ${className}` : "loading-state";

  return (
    <div className={wrapperClassName} role="status" aria-live="polite">
      <span className="loading-state__spinner" aria-hidden="true" />
      <span className="loading-state__message">{message ?? t("loaders.preparingPortfolio")}</span>
    </div>
  );
};

export default LoadingState;
