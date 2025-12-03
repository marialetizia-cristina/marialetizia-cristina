import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        works: "Works",
        about: "About",
        services: "Services",
        contact: "Contact",
        backTop: "Back to top",
        backHome: "Back to Home",
      },
      hero: {
        subtitle: "Graphic designer and illustrator",
      },
      sections: {
        about: "ABOUT ME",
        services: "SERVICES",
        contact: "CONTACT",
      },
      categories: {
        all: "All",
        graphicDesign: "Graphic Design",
        illustrations: "Illustrations",
        giftArt: "Gift Art",
        featured: "Featured",
      },
      portfolio: {
        headline: "PORTFOLIO",
        titleAll: "ALL",
        titleGraphic: "GRAPHIC DESIGN",
        titleIllustrations: "ILLUSTRATIONS",
        titleGift: "GIFT ART",
      },
      works: {
        seeMoreLines: ["SEE", "MORE", "PROJ", "ECT"],
        empty: "No works available.",
      },
      giftArt: {
        notice: {
          title: "This space is under construction",
          body: "I am curating new bespoke illustration experiences for this section. Please check back soon to discover fresh gift art projects.",
          cta: "Browse the other works",
        },
      },
      loaders: {
        preparingPortfolio: "I’m setting up the portfolio, just a moment…",
        loadingProject: "Fetching the project, one sec…",
      },
      single: {
        errors: {
          noSelection: "No work selected.",
          invalidId: "Invalid work identifier.",
          notFound: "Unable to find the requested work.",
        },
        featuredAlt: "Featured image",
        back: {
          home: "Back to Home",
          works: "Back to Works",
          graphic: "Back to Graphic Design",
          illustrations: "Back to Illustrations",
          previous: "Back to previous page",
        },
      },
    },
  },
  it: {
    translation: {
      nav: {
        works: "Lavori",
        about: "Chi sono",
        services: "Servizi",
        contact: "Contatti",
        backTop: "Torna su",
        backHome: "Torna alla home",
      },
      hero: {
        subtitle: "Graphic designer e illustratrice",
      },
      sections: {
        about: "CHI SONO",
        services: "SERVIZI",
        contact: "CONTATTI",
      },
      categories: {
        all: "Tutti",
        graphicDesign: "Graphic design",
        illustrations: "Illustrazioni",
        giftArt: "Gift art",
        featured: "In evidenza",
      },
      portfolio: {
        headline: "PORTFOLIO",
        titleAll: "TUTTI",
        titleGraphic: "GRAPHIC DESIGN",
        titleIllustrations: "ILLUSTRAZIONI",
        titleGift: "GIFT ART",
      },
      works: {
        seeMoreLines: ["VEDI", "ALTRI", "PRO", "GETTI"],
        empty: "Nessun lavoro disponibile.",
      },
      giftArt: {
        notice: {
          title: "Questa area è in costruzione",
          body: "Sto selezionando nuove illustrazioni personalizzate da mostrare qui. Torna presto per scoprire i progetti di gift art.",
          cta: "Guarda gli altri lavori",
        },
      },
      loaders: {
        preparingPortfolio: "Sto allestendo il portfolio, un attimo di pazienza…",
        loadingProject: "Sto recuperando il progetto, arrivo subito…",
      },
      single: {
        errors: {
          noSelection: "Nessun progetto selezionato.",
          invalidId: "Identificatore del progetto non valido.",
          notFound: "Impossibile trovare il progetto richiesto.",
        },
        featuredAlt: "Immagine in evidenza",
        back: {
          home: "Torna alla home",
          works: "Torna ai lavori",
          graphic: "Torna a Graphic design",
          illustrations: "Torna a Illustrazioni",
          previous: "Torna alla pagina precedente",
        },
      },
    },
  },
} as const;

const storedLanguage = typeof window !== "undefined" ? localStorage.getItem("lang") : null;

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage ?? "it",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", lng => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem("lang", lng);
  }
});

export default i18n;
