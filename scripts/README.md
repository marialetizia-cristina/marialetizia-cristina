# Sync WordPress

Richiede Node.js >= 22.18 (TypeScript nativo con sintassi eliminabile). Nessuna dipendenza aggiuntiva.

```sh
pnpm sync:wordpress
pnpm test:sync
```

Configurazione tramite ambiente del processo, senza caricamento automatico di `.env`:

- `WORDPRESS_REST_URL`: default `https://marialetizia.netsons.org/wp-json`.
- `SYNC_OUTPUT_DIR`: default `public/data/wordpress`.

Il workflow passa già `SYNC_OUTPUT_DIR`. Per cambiare server in GitHub Actions, configura la repository variable `WORDPRESS_REST_URL`.

Lo script usa solo GET pubblici, senza token o credenziali WooCommerce:

- `wp/v2/posts`: tutti i lavori pubblicati, tutte le lingue, media e tassonomie incorporati;
- `wp/v2/pages`: tutte le pagine pubblicate con lo stesso embed;
- `portfolio-letizia/v1/products`: endpoint pubblico custom già usato dal frontend, non la REST API amministrativa WooCommerce.

Produce `works.json`, `featured-works.json` (categorie 14 e 60, come nel frontend), `pages.json`, `products.json`. Mantiene i campi REST, incluse traduzioni e collegamenti ai prodotti; non scarica i file immagine. Le liste complete sostituiscono quelle precedenti, rimuovendo anche i contenuti eliminati. Chiavi e ordinamenti sono deterministici e non vengono aggiunti timestamp.

Post e pagine richiedono entrambi gli header `X-WP-Total` e `X-WP-TotalPages`: tutte le pagine vengono lette e i conteggi verificati. L'endpoint custom prodotti è trattato come lista completa se non espone header di paginazione, coerentemente con il client attuale; se li espone, vengono seguiti e verificati. Il backend deve quindi restituire tutti i prodotti oppure esporre entrambi gli header. Un errore prodotti, anche 404, interrompe il sync: non è interpretato come catalogo vuoto.

Ogni richiesta ha timeout di 30 secondi. Errori HTTP, record invalidi, duplicati, conteggi incompleti o variazioni dei totali durante la paginazione causano exit code 1 prima di scrivere i JSON. Non è una transazione sul database remoto: modifiche concorrenti che mantengono gli stessi conteggi non sono rilevabili. Il trigger successivo rilegge lo snapshot completo.

I file vengono preparati in una cartella temporanea e poi rinominati singolarmente. Errori del filesystem interrompono il job, che non deve fare commit: l'atomicità della pubblicazione dell'insieme è data dal successivo commit Git, non da una transazione locale sui quattro file. Non eseguire due sync contemporanei nella stessa cartella.

I test usano risposte simulate e cartelle temporanee; non modificano WordPress né chiamano GitHub. Il frontend deve ancora essere collegato a questi JSON: finché usa le API attuali, la sua attesa rimane. Carrello, checkout, richieste e upload continuano a usare WordPress; prezzi e disponibilità dello snapshot sono informativi e vanno riconfermati dal backend all'acquisto.
