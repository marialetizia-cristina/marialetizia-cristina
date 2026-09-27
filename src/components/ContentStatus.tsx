import { useTranslation } from "react-i18next";
import { useContentStore } from "../store/useContentStore";

export default function ContentStatus() {
  const errors = useContentStore(state => state.errors);
  const { i18n } = useTranslation();
  if (!Object.values(errors).some(Boolean)) return null;
  const english = i18n.language.startsWith("en");
  const retry = () => {
    const store = useContentStore.getState();
    if (errors.works) void store.loadWorks();
    if (errors.featuredWorks) void store.loadFeaturedWorks();
    if (errors.pages) void store.loadPages();
    if (errors.products) void store.loadProducts();
  };
  return (
    <div className="container" role="alert">
      <p>{english ? "Some content could not be loaded." : "Non è stato possibile caricare alcuni contenuti."}</p>
      <button type="button" onClick={retry}>{english ? "Try again" : "Riprova"}</button>
    </div>
  );
}
