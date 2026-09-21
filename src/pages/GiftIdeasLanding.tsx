import { useEffect } from "react";
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
    eyebrow: "Crea il tuo regalo creativo su misura",
    title: "Idee regalo personalizzate",
    description: "Regali illustrati e progetti grafici personalizzati, pensati su misura per compleanni, anniversari, lauree e altre occasioni speciali.",
    sectionTitle: "Un regalo costruito intorno alla tua idea",
    sectionBody: "Puoi scegliere un prodotto esistente oppure raccontarmi da zero la persona, l’occasione e lo stile che immagini. Valuterò la tua richiesta e, quando il prezzo dipende dalla personalizzazione, ti invierò un preventivo prima di procedere.",
    occasionsTitle: "Idee per le tue occasioni speciali",
    occasions: ["Compleanni e lauree", "Anniversari e ricorrenze", "Ritratti e illustrazioni personalizzate", "Album, calendari e progetti grafici"],
    customSectionTitle: "La tua idea",
    customSectionSubtitle: "Richiedi una consulenza gratuita per un regalo speciale",
    customTitle: "Hai qualcosa in mente e non sai come realizzarla?",
    customBody: "Descrivi la tua idea, il destinatario e l’occasione: la richiesta non comporta un acquisto immediato e riceverai una proposta su misura.",
    customCta: "Richiedi un’idea personalizzata",
  },
  en: {
    eyebrow: "Create your bespoke creative gift",
    title: "Personalized gift ideas",
    description: "Illustrated gifts and personalized graphic projects created for birthdays, anniversaries, graduations and other special occasions.",
    sectionTitle: "A gift designed around your idea",
    sectionBody: "Choose an existing product or tell me about the person, occasion and style you have in mind. I’ll review your request and, when the final price depends on customization, send you a quote before proceeding.",
    occasionsTitle: "Ideas for your special occasions",
    occasions: ["Birthdays and graduations", "Anniversaries and celebrations", "Custom portraits and illustrations", "Albums, calendars and graphic projects"],
    customSectionTitle: "Your idea",
    customSectionSubtitle: "Request a free consultation for a special gift",
    customTitle: "Have something in mind and don’t know how to create it?",
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
        <h1>{content.title}</h1>
        <p className="gift-ideas-landing__eyebrow">{content.eyebrow}</p>
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
        <header className="gift-ideas-landing__custom-header">
          <h2>{content.customSectionTitle}</h2>
          <p>{content.customSectionSubtitle}</p>
        </header>
        <div className="gift-ideas-landing__custom-grid">
          <FlowOneCard giftIdeasReturnPath={canonicalPath} />
          <div className="gift-ideas-landing__custom-copy">
            <h3 id="gift-custom-title">{content.customTitle}</h3>
            <p>{content.customBody}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GiftIdeasLanding;
