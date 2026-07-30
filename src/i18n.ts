import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        works: "Works",
        home: "Home",
        about: "About",
        services: "Services",
        contact: "Contact",
        backTop: "Back",
        backHome: "Back",
        privecyPolicy: "Privacy and Policy",
        products: "Products",
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
        giftArt: "Gift Ideas",
        featured: "Featured",
      },
      portfolio: {
        headline: "PORTFOLIO",
        titleAll: "ALL",
        titleGraphic: "GRAPHIC DESIGN",
        titleIllustrations: "ILLUSTRATIONS",
        titleGift: "GIFT IDEAS",
        titlePrivacyAndPolicy: "PRIVACY AND POLICY",
      },
      works: {
        seeMoreLines: ["SEE", "MORE"],
        empty: "No projects here right now — come back soon for fresh work!",
      },
      product: {
        backToProducts: "Back to products",
        loading: "Loading product...",
        error: "Error",
        loadError: "Error loading product",
        notFound: "Product not found.",
        digitalPreview: "Digital file preview",
        previewAlt: "Preview",
        purchaseToUnlock: "Purchase to unlock download",
        downloadFile: "Download file",
        addToCart: "Add to cart",
        addedToCart: "Added to cart",
      },
      giftArt: {
        notice: {
          title: "This space is under construction",
          body: "I am curating new bespoke illustration experiences for this section. Please check back soon to discover fresh gift art projects.",
          cta: "Browse the other works",
        },
      },
      credits: {
        designLabel: "Graphic project",
        devLabel: "Website development",
        design: "Graphic project: Marialetizia Cristina",
        dev: "Website development: Niccolò Maffioli, Riccardo Marchesi",
      },
      loaders: {
        preparingPortfolio: "Loading works...",
        loadingProject: "Fetching the project...",
      },
      single: {
        errors: {
          noSelection: "No work selected.",
          invalidId: "Invalid work identifier.",
          notFound: "Oops! This project is playing hide and seek. Feel free to explore the other works in the meantime.",
        },
        featuredAlt: "Featured image",
        back: {
          home: "Back",
          works: "Back",
          graphic: "Back",
          illustrations: "Back",
          previous: "Back",
        },
      },
    },
  },
  it: {
    translation: {
      nav: {
        works: "Lavori",
        home: "Home",
        about: "Chi sono",
        services: "Servizi",
        contact: "Contatti",
        backTop: "Torna su",
        backHome: "Indietro",
        privecyPolicy: "Privacy e Policy",
        products: "Prodotti",
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
        giftArt: "Gift ideas",
        featured: "In evidenza",
      },
      portfolio: {
        headline: "PORTFOLIO",
        titleAll: "TUTTI",
        titleGraphic: "GRAPHIC DESIGN",
        titleIllustrations: "ILLUSTRAZIONI",
        titleGift: "GIFT IDEAS",
        titlePrivacyAndPolicy: "PRIVACY E POLICY",
      },
      works: {
        seeMoreLines: ["VEDI", "ALTRO"],
        empty: "Al momento non c’è nulla da mostrare qui: torna presto per nuovi lavori!",
      },
      product: {
        backToProducts: "Torna ai prodotti",
        loading: "Caricamento prodotto...",
        error: "Errore",
        loadError: "Errore nel caricamento del prodotto",
        notFound: "Prodotto non trovato.",
        digitalPreview: "Anteprima file digitale",
        previewAlt: "Anteprima",
        purchaseToUnlock: "Acquista per sbloccare il download",
        downloadFile: "Scarica file",
        addToCart: "Aggiungi al carrello",
        addedToCart: "Aggiunto al carrello",
      },
      giftArt: {
        notice: {
          title: "Questa area è in costruzione",
          body: "Sto selezionando nuove illustrazioni personalizzate da mostrare qui. Torna presto per scoprire i progetti di gift art.",
          cta: "Guarda gli altri lavori",
        },
      },
      credits: {
        designLabel: "Progetto grafico",
        devLabel: "Programmazione sito",
        design: "Progetto grafico: Marialetizia Cristina",
        dev: "Programmazione sito: Niccolò Maffioli, Riccardo Marchesi",
      },
      loaders: {
        preparingPortfolio: "Caricamento lavori in corso...",
        loadingProject: "Caricamento progetto...",
      },
      single: {
        errors: {
          noSelection: "Nessun progetto selezionato.",
          invalidId: "Identificatore del progetto non valido.",
          notFound: "Ops! Questo progetto si sta facendo desiderare. Nel frattempo esplora pure gli altri lavori.",
        },
        featuredAlt: "Immagine in evidenza",
        back: {
          home: "Indietro",
          works: "Indietro",
          graphic: "Indietro",
          illustrations: "Indietro",
          previous: "Indietro",
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
