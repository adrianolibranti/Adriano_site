# Sito Adriano Libranti — Portfolio

Sito cinematografico per il portfolio di **Adriano Libranti**,
Creative Strategist (storytelling, copy, design, UX, cinema).
Ispirazione estetica: [floema.com](https://floema.com/en).

Solo HTML/CSS/JS "vanilla" — nessun framework, nessun passo di build.
Basta aprire `index.html` nel browser (o vedi "Come vedere il sito").

## Struttura

```
index.html                    → homepage
lavori.html                   → smistamento "Brand e comunicazione" / "Eventi"
brand-comunicazione.html      → elenco progetti di brand e comunicazione
eventi.html                   → elenco progetti eventi
progetti-personali.html       → elenco progetti personali, a strisce

progetto-aurora.html          → esempio: identità visiva (galleria grande)
progetto-notte-bianca.html    → esempio: evento (video)

the_social_prosthesis.html    → progetto personale: docufilm (video YouTube + galleria + script PDF)
il-broccolo-americano.html    → progetto personale: sinossi di sceneggiatura (solo testo + PDF)
stand-out-dont-fit-in.html     → progetto personale: grafica (artwork intera + citazione + download)

assets/css/style.css          → tutti gli stili (colori, font, layout, animazioni)
assets/js/main.js             → interazioni (preloader, cursore, reveal, hover)
assets/img/                   → immagini reali
assets/img/progetti/<nome>/   → immagini/video/PDF di ogni singolo progetto
```

`progetto-aurora.html` e `progetto-notte-bianca.html` sono ancora
segnaposto d'esempio (la cartella dei loro asset è vuota, mostrano i
gradienti); gli altri tre sono progetti veri, già pubblicati.

## Come aggiungere un nuovo progetto (veloce)

1. **Duplica** una pagina progetto esistente (es. `the_social_prosthesis.html`
   o `il-broccolo-americano.html`) e rinominala `nome-progetto.html`
   (tutto minuscolo, trattini al posto degli spazi). Guarda i progetti
   già fatti per capire come si combinano i blocchi:
   - `progetto-aurora.html` → testo + galleria grande (identità visiva)
   - `progetto-notte-bianca.html` → testo + video (evento)
   - `the_social_prosthesis.html` → testo + video YouTube + galleria + PDF
   - `il-broccolo-americano.html` → solo testo + PDF (nessuna foto)
   - `stand-out-dont-fit-in.html` → testo + artwork intera + citazione + download
2. **Crea la cartella** delle sue immagini: `assets/img/progetti/nome/`
   (copia una di quelle esistenti come esempio).
3. **Scegli i blocchi** che ti servono nel file appena duplicato,
   cancella quelli che non ti servono:
   - `.project-body__text` — un paragrafo di testo (quanti vuoi)
   - `.project-video` — un video (placeholder, `<video>` o `<iframe>` YouTube/Vimeo)
   - `.project-gallery` — una galleria di immagini (quante vuoi)
   - `.project-document` — un file scaricabile (PDF ecc.) come card
   - `.project-quote` — una citazione in evidenza
   - `.project-artwork` — una singola immagine a piena risoluzione, non ritagliata
4. **Compila** titolo, meta (cliente/anno/ruolo) e testi — cerca
   `MODIFICA QUI` nel file.
5. **Collega il progetto** dalla sua pagina elenco
   (`brand-comunicazione.html`, `eventi.html` o
   `progetti-personali.html`): trova una card/striscia e sostituisci
   `href="#"` con il file appena creato.

Tutto il resto (header, cursore, footer, animazioni "reveal") è
identico ovunque e non richiede modifiche: è definito una volta sola
in `assets/css/style.css` e `assets/js/main.js`.

## Cosa modificare più spesso

- **Testi**: direttamente in ogni pagina `.html`, ogni sezione ha un
  commento che spiega cosa contiene. Cerca `MODIFICA QUI`.
- **Colori e font**: in cima a `assets/css/style.css`, sezione
  `1. VARIABILI GLOBALI` (`:root { ... }`).
- **Immagini/video dei progetti**: vedi "Come aggiungere un nuovo
  progetto" sopra. Finché non ci sono file veri, il sito mostra
  gradienti CSS segnaposto — niente si rompe nel frattempo.
- **Email e social nel footer**: presente in ogni pagina, sezione
  `CONTATTI`/`FOOTER`.

## Come vedere il sito

Apri semplicemente `index.html` con un doppio click, oppure con un
server locale (consigliato, dato che il sito ha più pagine collegate
tra loro):

```bash
cd "Sito Adriano Libranti"
python3 -m http.server 8000
```

poi vai su `http://localhost:8000`.
