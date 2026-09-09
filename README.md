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
progetti-personali.html       → elenco progetti personali/corti, a strisce
progetto-aurora.html          → progetto: identità visiva (galleria grande)
progetto-notte-bianca.html    → progetto: evento (video)
the_social_prosthesis.html    → progetto: docufilm (galleria piccola)

assets/css/style.css          → tutti gli stili (colori, font, layout, animazioni)
assets/js/main.js             → interazioni (preloader, cursore, reveal, hover)
assets/img/                   → immagini reali
assets/img/progetti/<nome>/   → immagini/video di ogni singolo progetto
```

## Come aggiungere un nuovo progetto (veloce)

1. **Duplica** una pagina progetto esistente (es. `progetto-aurora.html`)
   e rinominala `progetto-nome.html` (tutto minuscolo, trattini al
   posto degli spazi). Sono i 3 esempi più completi da cui partire —
   guardali per capire come si combinano i blocchi:
   - `progetto-aurora.html` → testo + galleria grande (identità visiva)
   - `progetto-notte-bianca.html` → testo + video (evento)
   - `the_social_prosthesis.html` → testo + galleria piccola (corto/docufilm)
2. **Crea la cartella** delle sue immagini: `assets/img/progetti/nome/`
   (copia una di quelle esistenti come esempio, es.
   `assets/img/progetti/aurora-identita-visiva/`).
3. **Scegli i blocchi** che ti servono nel file appena duplicato:
   testo (`.project-body__text`), video (`.project-video`), galleria
   (`.project-gallery`) — cancella quelli che non ti servono.
4. **Compila** titolo, meta (cliente/anno/ruolo) e testi — cerca
   `MODIFICA QUI` nel file.
5. **Collega il progetto** dalla sua pagina elenco
   (`brand-comunicazione.html`, `eventi.html` o
   `progetti-personali.html`): trova una card/striscia placeholder
   e sostituiscile `href="#"` con il file appena creato.

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
