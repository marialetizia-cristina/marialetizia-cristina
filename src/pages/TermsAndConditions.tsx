import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { usePageMeta } from "../utils/usePageMeta";
import "../style/PrivacyAndPolicy.css";

const copy = {
  it: {
    title: "Termini e condizioni",
    description: "Termini e condizioni di vendita del sito di Marialetizia Cristina.",
    draftTitle: "Bozza da completare prima della pubblicazione definitiva",
    draftBody: "Questa pagina contiene la struttura predisposta per i termini di vendita. Sede, recapiti, aree di consegna, tempi, costi e procedure operative devono essere confermati da Marialetizia e il testo deve essere verificato da un professionista prima di attivare gli acquisti reali.",
    updated: "Ultimo aggiornamento della bozza: 28 agosto 2026.",
    sections: [
      ["1. Informazioni sul venditore", ["Venditore: Marialetizia Cristina.", "Partita IVA: 03018010185.", "Sede legale o operativa: [DA COMPLETARE].", "Indirizzo e-mail per assistenza e reclami: marialetizia.cristina@gmail.com."]],
      ["2. Ambito di applicazione", ["Questi termini disciplinano gli acquisti e le richieste effettuati tramite il sito da consumatori finali.", "Il sito consente ai clienti di richiedere lavori grafici su misura e prodotti o servizi personalizzati. A seconda della natura del lavoro richiesto, il prezzo può essere determinato anticipatamente e mostrato sul sito oppure essere stabilito mediante un preventivo individuale.", "L’invio di una richiesta completamente personalizzata o di una richiesta relativa a un prodotto a prezzo variabile non costituisce un acquisto e non crea un obbligo di pagamento. In questi casi, il contratto si conclude soltanto dopo che il relativo preventivo è stato accettato secondo la procedura comunicata al cliente.", "Per i prodotti o servizi personalizzati il cui prezzo può essere determinato anticipatamente, il cliente può effettuare un ordine direttamente tramite il sito. Il prezzo applicabile e gli eventuali costi aggiuntivi sono mostrati prima che il cliente invii l’ordine e assuma un obbligo di pagamento."]],
      ["3. Prodotti e personalizzazioni", ["Le caratteristiche essenziali, il prezzo e la natura fisica o digitale di ciascun prodotto sono indicati nella relativa scheda.", "I prodotti e servizi acquistabili tramite il sito sono realizzati su richiesta del cliente e prevedono un’attività di progettazione, elaborazione e/o personalizzazione grafica svolta sulla base delle indicazioni fornite al momento dell’ordine. Gli articoli indicati come personalizzabili non costituiscono prodotti standard già realizzati: il prezzo può essere predeterminato quando le caratteristiche della prestazione consentono di definirne anticipatamente il corrispettivo.", "Il cliente è responsabile della correttezza dei testi, nomi, immagini e istruzioni inviati per la personalizzazione e deve avere il diritto di utilizzare i materiali trasmessi.", "Eventuali modalità di approvazione delle bozze e numero di revisioni incluse: [DA DEFINIRE]."]],
      ["4. Prezzi, ordini e pagamenti", ["Per i prodotti a prezzo fisso, il prezzo applicabile è quello mostrato prima dell’invio dell’ordine, insieme agli eventuali costi aggiuntivi.", "Per i prodotti a prezzo variabile e per le richieste completamente personalizzate, il prezzo viene comunicato tramite preventivo e non è previsto un pagamento immediato sul sito.", "Il metodo di pagamento attualmente previsto è PayPal. Eventuali ulteriori metodi resi disponibili tramite PayPal saranno mostrati nel checkout prima della conferma dell’ordine. L’autorizzazione o l’addebito avviene durante la conferma del pagamento attraverso il servizio selezionato."]],
      ["5. Produzione, consegna e contenuti digitali", ["Tempi di produzione, territori serviti, modalità di consegna o spedizione ed eventuali costi dipendono dal prodotto scelto. Le condizioni applicabili sono indicate nella scheda prodotto, nel checkout oppure nel preventivo prima che il cliente assuma un obbligo di pagamento.", "Per i prodotti digitali devono essere specificati formato, modalità di consegna, compatibilità ed eventuali limiti d’uso.", "L’avvio immediato della fornitura di contenuti digitali e le relative conseguenze sul diritto di recesso richiedono, quando applicabile, il consenso espresso del consumatore."]],
      ["6. Diritto di recesso", ["Salvo le eccezioni previste dalla legge, il consumatore può recedere da un acquisto a distanza entro 14 giorni nei termini e con le modalità previste dalla normativa applicabile.", "Il diritto di recesso può essere escluso per beni confezionati su misura o chiaramente personalizzati. L’eventuale esclusione deve essere comunicata chiaramente prima dell’acquisto.", "La procedura, il recapito per la comunicazione, il modulo di recesso e le regole sui costi di restituzione devono essere completati prima dell’apertura delle vendite."]],
      ["7. Prodotti difettosi e garanzia legale", ["L’eventuale esclusione del recesso per un prodotto personalizzato non elimina i diritti del consumatore in caso di difetto, non conformità o prodotto diverso da quanto ordinato.", "Le modalità di segnalazione e gestione dei reclami devono essere comunicate attraverso il recapito di assistenza indicato nella sezione 1."]],
      ["8. Proprietà intellettuale e materiali del cliente", ["I contenuti originali presenti nel sito e i lavori realizzati restano protetti dalla normativa applicabile.", "Licenze d’uso, utilizzo commerciale dei file finali ed eventuale autorizzazione alla pubblicazione del lavoro nel portfolio devono essere definiti espressamente nel prodotto o nel preventivo."]],
      ["9. Privacy", ["Il trattamento dei dati personali avviene secondo l’informativa privacy del sito. I file inviati per la personalizzazione richiedono regole specifiche su accesso, conservazione e cancellazione."]],
      ["10. Legge applicabile e controversie", ["Legge applicabile, foro competente e modalità di risoluzione extragiudiziale delle controversie: [DA VERIFICARE CON UN PROFESSIONISTA, SENZA LIMITARE I DIRITTI INDEROGABILI DEL CONSUMATORE]."]],
    ],
    privacy: "Consulta anche l’Informativa privacy.",
  },
  en: {
    title: "Terms and Conditions",
    description: "Terms and conditions of sale for Marialetizia Cristina's website.",
    draftTitle: "Draft to be completed before final publication",
    draftBody: "This page provides the structure for the terms of sale. Address, contact details, delivery areas, timing, costs and operating procedures must be confirmed by Marialetizia, and the text must be reviewed by a professional before real purchases are enabled.",
    updated: "Draft last updated: 28 August 2026.",
    sections: [
      ["1. Seller information", ["Seller: Marialetizia Cristina.", "VAT number: 03018010185.", "Registered or operating address: [TO BE COMPLETED].", "Email address for support and complaints: marialetizia.cristina@gmail.com."]],
      ["2. Scope", ["These terms govern purchases and requests made through the website by final consumers.", "The website allows customers to request custom graphic work and personalized products or services. Depending on the nature of the requested work, the price may either be determined in advance and displayed on the website or established through an individual quote.", "Submitting a fully custom request or a request for a variable-price product does not constitute a purchase or create an obligation to pay. In these cases, a contract is formed only after the applicable quote has been accepted according to the procedure communicated to the customer.", "For personalized products or services whose price can be determined in advance, the customer may place an order directly through the website. The applicable price and any additional charges are displayed before the customer submits the order and assumes an obligation to pay."]],
      ["3. Products and customization", ["The main characteristics, price and physical or digital nature of each product are stated on its product page.", "Products and services available for purchase through the website are created at the customer’s request and involve graphic design, processing and/or customization carried out according to the instructions provided when the order is placed. Items described as customizable are not standard, pre-made products: the price may be determined in advance when the characteristics of the work make it possible to establish the amount beforehand.", "Customers are responsible for the accuracy of the text, names, images and instructions supplied for customization and must have the right to use submitted materials.", "Proof approval process and number of included revisions: [TO BE DEFINED]."]],
      ["4. Prices, orders and payments", ["For fixed-price products, the applicable price is displayed before the order is submitted, together with any additional charges.", "For variable-price products and fully custom requests, the price is supplied by quote and no immediate website payment is required.", "The payment method currently planned is PayPal. Any additional methods made available through PayPal will be displayed at checkout before the order is confirmed. Authorization or charging takes place during payment confirmation through the selected service."]],
      ["5. Production, delivery and digital content", ["Production times, served territories, delivery or shipping methods and any applicable costs depend on the selected product. The applicable conditions are stated on the product page, at checkout or in the quote before the customer assumes an obligation to pay.", "Digital products must state their format, delivery method, compatibility and any usage limitations.", "Immediate supply of digital content and its effect on withdrawal rights requires the consumer's express agreement where applicable."]],
      ["6. Right of withdrawal", ["Subject to legal exceptions, consumers may withdraw from a distance purchase within 14 days under the conditions and procedures established by applicable law.", "The right of withdrawal may be excluded for made-to-order or clearly personalized goods. Any exclusion must be clearly communicated before purchase.", "The procedure, contact address, withdrawal form and return-cost rules must be completed before sales open."]],
      ["7. Defective products and legal guarantee", ["An exclusion of withdrawal for personalized goods does not remove consumer rights when a product is defective, non-conforming or different from what was ordered.", "The reporting and complaints procedure must use the support contact stated in section 1."]],
      ["8. Intellectual property and customer materials", ["Original website content and completed works remain protected under applicable law.", "Usage licences, commercial use of final files and permission to display completed work in the portfolio must be expressly defined in the product information or quote."]],
      ["9. Privacy", ["Personal data is processed according to the website privacy notice. Files submitted for customization require specific rules covering access, retention and deletion."]],
      ["10. Applicable law and disputes", ["Applicable law, jurisdiction and out-of-court dispute resolution procedures: [TO BE REVIEWED BY A PROFESSIONAL WITHOUT RESTRICTING MANDATORY CONSUMER RIGHTS]."]],
    ],
    privacy: "Please also read the Privacy Policy.",
  },
} as const;

const TermsAndConditions = () => {
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith("en") ? "en" : "it";
  const content = copy[language];
  usePageMeta(content.title, content.description, "/terms-and-conditions", true);

  return (
    <section className="privacy-and-policy terms-and-conditions">
      <h1 className="privacy-and-policy__title">{content.title}</h1>
      <div className="privacy-and-policy__content">
        <div>
          <aside className="terms-and-conditions__draft" role="note">
            <strong>{content.draftTitle}</strong>
            <p>{content.draftBody}</p>
          </aside>
          <p>{content.updated}</p>
          {content.sections.map(([heading, paragraphs]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <p><Link to="/privacyandpolicy">{content.privacy}</Link></p>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
