/* =================================================================
   ADRIANO LIBRANTI — PORTFOLIO
   Script principale. Vanilla JS, nessuna libreria esterna, così è
   facile da leggere e modificare.

   Il file è diviso in piccole funzioni indipendenti, ognuna
   responsabile di UNA sola interazione. Sono tutte richiamate in
   fondo al file, nel blocco "AVVIO". Se vuoi disattivare un
   effetto, basta commentare la relativa riga nel blocco AVVIO.

   INDICE:
   1. initPreloader     → schermata di caricamento iniziale
   2. initCustomCursor   → cursore che segue il mouse
   3. initScrollReveal   → animazioni "reveal" quando si scrolla
   4. initHoverPreview   → anteprima immagine sulle righe servizi/lavori
   5. initFooterYear     → anno corrente nel footer
   6. initHeaderScrollState → aggiunge un bordo sotto l'header quando si scrolla
   7. AVVIO
   ================================================================= */


/* -----------------------------------------------------------------
   1. PRELOADER
   Conta da 0 a 100 e poi nasconde la schermata di caricamento.
   Il conteggio è puramente estetico (non aspetta davvero il
   caricamento di risorse pesanti): dura circa 1.4s.
   MODIFICA QUI "duration" per allungare/accorciare l'effetto.
----------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const countEl = document.getElementById("preloaderCount");
  if (!preloader || !countEl) return;

  document.body.classList.add("is-loading");

  const duration = 1400; // millisecondi totali dell'animazione di conteggio
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    countEl.textContent = Math.round(progress * 100);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Conteggio finito: nascondiamo il preloader e sblocchiamo lo scroll
      preloader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
    }
  }

  requestAnimationFrame(tick);
}


/* -----------------------------------------------------------------
   2. CURSORE CUSTOM
   Il punto centrale segue il mouse istantaneamente; l'anello
   esterno lo insegue con un piccolo "ritardo" (interpolazione
   lineare, tecnica detta "lerp") per dare un effetto morbido.
   Su elementi con [data-cursor-text] mostriamo anche un'etichetta.
   Su elementi con [data-cursor="text"] (i testi grandi in Courier
   Prime: titolo hero, frase manifesto, quote...) mostriamo invece
   un caret lampeggiante stile macchina da scrivere.
----------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const label = document.getElementById("cursorLabel");
  const caret = document.getElementById("cursorCaret");
  if (!cursor || !dot || !ring) return;

  // Su schermi touch non c'è un "mouse" da inseguire: usciamo subito
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    // Il caret segue il mouse senza ritardo, come il punto: deve
    // sembrare "appoggiato" esattamente dove stai leggendo.
    if (caret) caret.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Loop di animazione: l'anello insegue il punto con un ritardo (0.15 = quanto è "pigro")
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Su ogni elemento cliccabile con data-cursor-text, ingrandiamo il
  // cursore e mostriamo l'etichetta (es. "Vai", "Scrivi"...).
  document.querySelectorAll("[data-cursor-text], a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hovering");
      if (label) label.textContent = el.dataset.cursorText || "";
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovering");
      if (label) label.textContent = "";
    });
  });

  // Su ogni testo grande con data-cursor="text" (titoli, frasi
  // manifesto...) mostriamo il caret al posto di punto/anello.
  // MODIFICA QUI: aggiungi/togli data-cursor="text" in index.html
  // per estendere o ridurre dove compare l'effetto.
  // La dimensione del caret (--caret-size, usata in style.css) viene
  // presa dalla font-size del testo sotto il mouse, così resta
  // proporzionata: enorme sul titolo hero, più piccola altrove.
  document.querySelectorAll('[data-cursor="text"]').forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("is-text-hovering");
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      if (caret && fontSize) caret.style.setProperty("--caret-size", `${fontSize}px`);
    });
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-text-hovering"));

    // Il caret prende sempre il colore ESATTO del testo che sta
    // coprendo (bianco di default, oro sulle parole in <em>) così
    // il blend-mode "difference" lo fa diventare nero in entrambi i
    // casi — non solo sull'oro. "mouseover" (a differenza di
    // "mouseenter") si riattiva anche passando da un figlio
    // all'altro (es. dal testo normale a un <em> e viceversa),
    // quindi il colore resta sempre aggiornato in tempo reale.
    el.addEventListener("mouseover", (e) => {
      if (caret) caret.style.setProperty("--caret-color", getComputedStyle(e.target).color);
    });
  });
}


/* -----------------------------------------------------------------
   3. SCROLL REVEAL
   Osserva tutti gli elementi con classe .reveal e aggiunge
   .is-visible quando entrano nella viewport, facendoli comparire
   con una piccola animazione (definita in style.css).
----------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  // Se il browser non supporta IntersectionObserver, mostriamo
  // tutto subito senza animazione (fallback semplice e sicuro).
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // basta animare una volta sola
        }
      });
    },
    { threshold: 0.15 } // si attiva quando il 15% dell'elemento è visibile
  );

  items.forEach((el) => observer.observe(el));
}


/* -----------------------------------------------------------------
   4. ANTEPRIMA IMMAGINE SULLE RIGHE SERVIZI
   Quando il mouse passa su una riga .services__row (o .work-card),
   mostriamo il box .hover-preview con il colore/immagine associata
   (tramite l'attributo data-preview) e lo facciamo seguire il mouse.
----------------------------------------------------------------- */
function initHoverPreview() {
  const preview = document.getElementById("hoverPreview");
  if (!preview) return;

  // Su touch non esiste un vero "hover": disattiviamo l'effetto
  if (window.matchMedia("(pointer: coarse)").matches) return;

  // Selezioniamo sia le righe dei servizi sia le card dei lavori:
  // entrambe usano lo stesso meccanismo data-preview.
  const targets = document.querySelectorAll("[data-preview]");

  let currentClass = null;

  targets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      currentClass = `preview--${el.dataset.preview}`;
      preview.className = "hover-preview is-active " + currentClass;
    });

    el.addEventListener("mousemove", (e) => {
      preview.style.left = `${e.clientX}px`;
      preview.style.top = `${e.clientY}px`;
    });

    el.addEventListener("mouseleave", () => {
      preview.classList.remove("is-active");
    });
  });
}


/* -----------------------------------------------------------------
   5. ANNO CORRENTE NEL FOOTER
   Evita di dover aggiornare manualmente il copyright ogni anno.
----------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* -----------------------------------------------------------------
   6. STATO HEADER ALLO SCROLL
   L'header è fisso (position: fixed) e ha uno sfondo semi-trasparente
   sfocato (definito in style.css) per evitare che il testo delle
   sezioni sottostanti si sovrapponga visivamente al logo/menu mentre
   si scrolla. Qui aggiungiamo solo la classe .is-scrolled al body
   dopo i primi px di scroll, così il CSS può mostrare una sottile
   linea di separazione sotto l'header.
----------------------------------------------------------------- */
function initHeaderScrollState() {
  const THRESHOLD = 40; // px di scroll dopo i quali mostrare il bordo

  function updateState() {
    document.body.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
  }

  window.addEventListener("scroll", updateState, { passive: true });
  updateState(); // stato corretto anche se la pagina si apre già scrollata
}


/* -----------------------------------------------------------------
   7. AVVIO
   Richiamiamo tutte le funzioni quando il DOM è pronto.
----------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initCustomCursor();
  initScrollReveal();
  initHoverPreview();
  initFooterYear();
  initHeaderScrollState();
});
