import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FlowOneCard } from "../components/FlowOneCard";
import { usePageMeta } from "../utils/usePageMeta";
import "../style/Products.css";
import "../style/GiftIdeasLanding.css";

type GiftIdeasLandingProps = {
  language: "it" | "en";
};

const copy = {
  it: {
    eyebrow: "Regali creativi su misura",
    title: "Idee regalo personalizzate",
    description: "Regali illustrati e progetti grafici personalizzati, pensati su misura per compleanni, anniversari, lauree e altre occasioni speciali.",
    sectionTitle: "Un regalo costruito intorno alla tua idea",
    sectionBody: "Puoi scegliere un prodotto esistente oppure raccontare da zero la persona, l’occasione e lo stile che immagini. Letizia valuterà la richiesta e, quando il prezzo dipende dalla personalizzazione, ti invierà un preventivo prima di procedere.",
    occasionsTitle: "Idee per occasioni speciali",
    occasions: ["Compleanni e lauree", "Anniversari e ricorrenze", "Ritratti e illustrazioni personalizzate", "Album, calendari e progetti grafici"],
    customTitle: "Hai in mente qualcosa di diverso?",
    customBody: "Descrivi la tua idea, il destinatario e l’occasione: la richiesta non comporta un acquisto immediato e riceverai una proposta su misura.",
    customCta: "Richiedi un’idea personalizzata",
  },
  en: {
    eyebrow: "Bespoke creative gifts",
    title: "Personalized gift ideas",
    description: "Illustrated gifts and personalized graphic projects created for birthdays, anniversaries, graduations and other special occasions.",
    sectionTitle: "A gift designed around your idea",
    sectionBody: "Choose an existing product or describe the person, occasion and style you have in mind. Letizia will review your request and, when the final price depends on customization, provide a quote before proceeding.",
    occasionsTitle: "Ideas for special occasions",
    occasions: ["Birthdays and graduations", "Anniversaries and celebrations", "Custom portraits and illustrations", "Albums, calendars and graphic projects"],
    customTitle: "Looking for something different?",
    customBody: "Describe your idea, recipient and occasion. This request does not require an immediate purchase, and you will receive a tailored proposal.",
    customCta: "Request a personalized idea",
  },
} as const;

const GiftIdeasLanding = ({ language }: GiftIdeasLandingProps) => {
  const { i18n } = useTranslation();
  const content = copy[language];
  const canonicalPath = language === "en" ? "/en/gift-ideas/" : "/idee-regalo/";

  usePageMeta(content.title, content.description, canonicalPath, false, {
    it: "/idee-regalo/",
    en: "/en/gift-ideas/",
    default: "/idee-regalo/",
  });

  useEffect(() => {
    if (!i18n.language.startsWith(language)) {
      void i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.giftIdeasSchema = "true";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: content.title,
      description: content.description,
      url: `https://marialetiziacristina.vercel.app${canonicalPath}`,
      inLanguage: language,
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [canonicalPath, content.description, content.title, language]);

  return (
    <main className="gift-ideas-landing">
      <header className="gift-ideas-landing__hero">
        <p className="gift-ideas-landing__eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="gift-ideas-landing__lead">{content.description}</p>
      </header>

      <section className="gift-ideas-landing__intro" aria-labelledby="gift-intro-title">
        <div>
          <h2 id="gift-intro-title">{content.sectionTitle}</h2>
          <p>{content.sectionBody}</p>
        </div>
        <div>
          <h2>{content.occasionsTitle}</h2>
          <ul>{content.occasions.map((occasion) => <li key={occasion}>{occasion}</li>)}</ul>
        </div>
      </section>

      <section className="gift-ideas-landing__custom" aria-labelledby="gift-custom-title">
        <div>
          <h2 id="gift-custom-title">{content.customTitle}</h2>
          <p>{content.customBody}</p>
          <Link className="gift-ideas-landing__cta" to="/request/custom-gift">{content.customCta}</Link>
        </div>
        <FlowOneCard />
      </section>
    </main>
  );
};

export default GiftIdeasLanding;
