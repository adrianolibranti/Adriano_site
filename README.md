# Sito Adriano Libranti — Portfolio

Homepage cinematografica per il portfolio di **Adriano Libranti**,
Creative Strategist (storytelling, copy, design, UX, cinema).
Ispirazione estetica: [floema.com](https://floema.com/en).

Solo HTML/CSS/JS "vanilla" — nessun framework, nessun passo di build.
Basta aprire `index.html` nel browser.

## Struttura

```
index.html            → homepage (unica pagina per ora)
assets/css/style.css  → tutti gli stili (colori, font, layout, animazioni)
assets/js/main.js     → interazioni (preloader, cursore, reveal, hover)
assets/img/           → dove mettere le immagini reali
```

## Cosa modificare più spesso

- **Testi**: direttamente in `index.html`, ogni sezione ha un commento
  che spiega cosa contiene. Cerca `MODIFICA QUI`.
- **Colori e font**: in cima a `assets/css/style.css`, sezione
  `1. VARIABILI GLOBALI` (`:root { ... }`).
- **Immagini di anteprima nei servizi/lavori**: al momento sono
  gradienti CSS segnaposto (`.preview--01`, `.preview--02`, ecc. e
  `.work-card[data-preview="a"]`, ecc.). Quando avrai le foto vere,
  sostituiscile con `background-image: url("../img/tuafoto.jpg")`.
- **Email e social nel footer**: in `index.html`, sezione `CONTATTI`.

## Come vedere il sito

Apri semplicemente il file `index.html` con un doppio click, oppure
con un server locale (facoltativo, utile solo se in futuro aggiungerai
più pagine con percorsi relativi):

```bash
cd "Sito Adriano Libranti"
python3 -m http.server 8000
```

poi vai su `http://localhost:8000`.

## Prossimi passi

Questa è **solo la homepage**. Le prossime sezioni da costruire:
pagina Lavori/Case study, pagina Chi sono estesa, eventuale pagina
Contatti dedicata. La struttura (variabili CSS, componenti, script)
è già pronta per essere riutilizzata nelle pagine successive.
