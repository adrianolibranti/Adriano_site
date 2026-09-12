/* =================================================================
   ADRIANO LIBRANTI — PORTFOLIO
   Script principale. Vanilla JS, nessuna libreria esterna, così è
   facile da leggere e modificare.

   Il file è diviso in piccole funzioni indipendenti, ognuna
   responsabile di UNA sola interazione. Sono tutte richiamate in
   fondo al file, nel blocco "AVVIO". Se vuoi disattivare un
   effetto, basta commentare la relativa riga nel blocco AVVIO.

   INDICE:
   1. initPreloader       → schermata di caricamento iniziale
   2. initCustomCursor    → cursore che segue il mouse
   3. initCursorTrail     → scia "a griglia" dietro al mouse
   4. initScrollReveal    → animazioni "reveal" quando si scrolla
   5. initFooterYear      → anno corrente nel footer
   6. initHeaderScrollState → aggiunge un bordo sotto l'header quando si scrolla
   7. initScrollText      → testo "macchina da scrivere" tra Hero e Chi sono
   8. initGalleryLightbox → apre/scorre le foto della mini-galleria a schermo intero
   9. AVVIO
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
   Non tocchiamo/nascondiamo mai il puntatore normale del sistema
   (niente più puntino/mirino/etichetta nostri: rimossi via via su
   richiesta). Qui resta solo il caret: su elementi con
   [data-cursor="text"] (i testi grandi in Courier Prime: titolo hero,
   frase manifesto, quote...) mostriamo una barretta lampeggiante
   stile macchina da scrivere al posto del puntatore — ma solo quando
   il mouse è davvero sopra una riga di testo, non ovunque dentro il
   blocco: un paragrafo su più righe è largo quanto la riga più lunga,
   quindi le righe più corte lascerebbero spazio vuoto a destra che
   altrimenti conterebbe come "sopra il testo". Per saperlo con
   precisione usiamo un Range dal primo all'ultimo nodo di testo
   dentro l'elemento: "getClientRects()" restituisce allora un
   rettangolo per ogni riga effettivamente occupata dalle lettere
   (comprese le parole in <em> dentro), non uno largo quanto il
   blocco. Un solo Range per elemento, non uno per nodo di testo: il
   testo animato allo scroll (typewriter) ne ha oltre 100 (uno per
   carattere) e ricalcolarne le righe ad ogni movimento del mouse era
   pesante — un Range che va dal primo all'ultimo nodo dà lo stesso
   risultato con una sola chiamata a "getClientRects()".
----------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const caret = document.getElementById("cursorCaret");
  if (!cursor || !caret) return;

  // Su schermi touch non c'è un "mouse" da inseguire: usciamo subito
  if (window.matchMedia("(pointer: coarse)").matches) return;

  // Il caret segue il mouse senza ritardo: deve sembrare "appoggiato"
  // esattamente dove stai leggendo.
  window.addEventListener("mousemove", (e) => {
    caret.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  function isOverText(range, x, y) {
    if (!range) return false;
    const rects = range.getClientRects();
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }
    return false;
  }

  // Su ogni testo grande con data-cursor="text" (titoli, frasi
  // manifesto...) mostriamo il caret al posto del puntatore normale.
  // MODIFICA QUI: aggiungi/togli data-cursor="text" in index.html
  // per estendere o ridurre dove compare l'effetto.
  function buildTextRange(el) {
    // Dal primo all'ultimo nodo di testo non vuoto (vedi il commento
    // in cima alla funzione sul perché un solo Range basta). Rifatto
    // ad ogni "mouseenter" invece che una volta sola all'avvio:
    // alcuni testi (es. quello animato allo scroll) vengono riscritti
    // in tanti <span> DOPO che questa funzione è partita — un Range
    // creato prima punterebbe a nodi ormai rimossi dalla pagina.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let first = null;
    let last = null;
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue; // solo spazi/a-capo: salta
      if (!first) first = node;
      last = node;
    }
    if (!first) return null; // niente testo dentro (non dovrebbe succedere)

    const range = document.createRange();
    range.setStart(first, 0);
    range.setEnd(last, last.length);
    return range;
  }

  document.querySelectorAll('[data-cursor="text"]').forEach((el) => {
    let textRange = null;
    let isActive = false;

    el.addEventListener("mouseenter", () => {
      textRange = buildTextRange(el);
    });

    el.addEventListener("mousemove", (e) => {
      const overText = isOverText(textRange, e.clientX, e.clientY);

      if (overText && !isActive) {
        isActive = true;
        cursor.classList.add("is-text-hovering");
        // Dimensione del caret (--caret-size, usata in style.css)
        // presa dalla font-size del testo, così resta proporzionata:
        // enorme sul titolo hero, più piccola altrove. Solo
        // all'attivazione, non ad ogni pixel di movimento.
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        if (fontSize) caret.style.setProperty("--caret-size", `${fontSize}px`);
      } else if (!overText && isActive) {
        isActive = false;
        cursor.classList.remove("is-text-hovering");
      }

      if (overText) {
        // Il caret prende sempre il colore ESATTO del testo che sta
        // coprendo in quel punto (bianco di default, arancio sulle
        // parole in <em>) così il blend-mode "difference" lo fa
        // diventare nero in entrambi i casi — non solo sull'accento.
        const target = document.elementFromPoint(e.clientX, e.clientY) || el;
        caret.style.setProperty("--caret-color", getComputedStyle(target).color);
      }
    });

    el.addEventListener("mouseleave", () => {
      isActive = false;
      cursor.classList.remove("is-text-hovering");
    });
  });
}


/* -----------------------------------------------------------------
   3. SCIA A GRIGLIA
   La pagina è divisa in una griglia invisibile di celle GRID_SIZE x
   GRID_SIZE. Quando il mouse entra in una cella diversa da quella di
   prima, "accendiamo" i contorni di quella cella (allineati alla
   griglia, non al pixel esatto del mouse — è quello che dà l'effetto
   "griglia" invece di una scia libera) e li lasciamo svanire, poi
   rimuoviamo l'elemento dal DOM.
   Fuori dal gruppo ".cursor" apposta (niente mix-blend-mode:
   difference), altrimenti non si vedrebbe arancione ma un colore
   diverso a seconda dello sfondo sotto — vedi ".cursor-trail-cell" in
   style.css.
   Disattivata mentre è attivo il caret (il cursore "testo" a barretta,
   vedi initCustomCursor): i due effetti insieme sopra una scritta
   erano confusi, meglio uno alla volta.
   MODIFICA QUI "GRID_SIZE" per una griglia più fitta/rada (la
   dimensione arriva al CSS da sola via la custom property
   "--grid-trail-size", non serve toccare style.css), "LIFETIME" per
   farla durare di più o meno (deve combaciare con la transizione di
   ".cursor-trail-cell" in style.css). Per un effetto più/meno
   presente, il colore/spessore sono invece in style.css.
----------------------------------------------------------------- */
function initCursorTrail() {
  if (window.matchMedia("(pointer: coarse)").matches) return; // niente su touch
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // rispetta chi preferisce meno animazioni

  const cursor = document.getElementById("cursor"); // per sapere se il caret è attivo, vedi sotto
  const GRID_SIZE = 42; // px di lato di ogni cella della griglia
  const LIFETIME = 700; // ms: deve combaciare con la transizione di ".cursor-trail-cell" in style.css

  // Dimensione scritta una sola volta in una custom property invece
  // che ad ogni cella creata (vedi ".cursor-trail-cell" in style.css,
  // che la legge da qui): un piccolo risparmio ripetuto ad ogni
  // scatto del mouse.
  document.documentElement.style.setProperty("--grid-trail-size", `${GRID_SIZE}px`);

  let lastKey = null;

  window.addEventListener("mousemove", (e) => {
    // Il cursore è già diventato un caret (testo grande sotto il
    // mouse, vedi initCustomCursor): niente quadratini finché resta così.
    if (cursor && cursor.classList.contains("is-text-hovering")) return;

    // Cella della griglia sotto il mouse (arrotondata per difetto):
    // stessa cella finché il mouse resta al suo interno, quindi non
    // creiamo un elemento a ogni singolo pixel di movimento.
    const cellX = Math.floor(e.clientX / GRID_SIZE) * GRID_SIZE;
    const cellY = Math.floor(e.clientY / GRID_SIZE) * GRID_SIZE;
    const key = cellX + "," + cellY;
    if (key === lastKey) return; // mouse ancora nella stessa cella: salta
    lastKey = key;

    const cell = document.createElement("span");
    cell.className = "cursor-trail-cell";
    cell.style.transform = `translate(${cellX}px, ${cellY}px) scale(1)`;
    document.body.appendChild(cell);

    // Per far partire davvero la transizione CSS, il browser deve
    // "vedere" questo stato iniziale prima del prossimo cambio: senza
    // questa riga (che legge una proprietà di layout, forzando il
    // browser a calcolarlo subito) i due cambi rischiano di finire
    // nello stesso aggiornamento e il quadratino sparirebbe di colpo
    // invece di svanire gradualmente.
    void cell.offsetWidth;

    cell.style.opacity = "0";
    cell.style.transform = `translate(${cellX}px, ${cellY}px) scale(0.7)`;

    setTimeout(() => cell.remove(), LIFETIME);
  });
}


/* -----------------------------------------------------------------
   4. SCROLL REVEAL
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
   7. TESTO "MACCHINA DA SCRIVERE" TRA HERO E CHI SONO
   A differenza di ".reveal" (che appare una volta sola quando entra
   nello schermo), questo testo resta agganciato alla posizione di
   scroll in tempo reale: più si scrolla, più caratteri vengono
   "digitati" — come una battitura a macchina, senza dissolvenze.

   Spezziamo il testo in tanti <span class="scroll-text__char"> (uno
   per carattere, invisibili di default — vedi style.css) camminando
   solo sui nodi di testo, poi ne mostriamo un numero crescente in
   base al progresso di scroll: 0 = appena entrato dal basso, niente
   scritto; 1 = arrivato a un terzo dall'alto dello schermo, tutto
   scritto.
   MODIFICA QUI START_VH/END_VH per allungare o accorciare la
   distanza di scroll su cui avviene la "battitura".
----------------------------------------------------------------- */
function initScrollText() {
  const container = document.getElementById("scrollText");
  if (!container) return;

  // Spezza il testo in caratteri una sola volta. Gli spazi restano
  // testo semplice (non diventano <span>) così le parole vanno a
  // capo normalmente.
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  const chars = []; // riferimento a tutti gli span, nell'ordine di lettura

  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    [...textNode.textContent].forEach((char) => {
      if (char === " ") {
        fragment.appendChild(document.createTextNode(" "));
      } else {
        const span = document.createElement("span");
        span.className = "scroll-text__char";
        span.textContent = char;
        fragment.appendChild(span);
        chars.push(span);
      }
    });
    textNode.parentNode.replaceChild(fragment, textNode);
  });

  // Chi preferisce meno animazioni lo vede già scritto tutto, fermo
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    chars.forEach((c) => c.classList.add("is-typed"));
    return;
  }

  const START_VH = 1;     // il testo è "appena entrato" quando il suo bordo superiore è al fondo dello schermo
  const END_VH = 0.4;     // ed è "tutto scritto" a circa metà dello scroll totale disponibile (tra Hero e Chi Sono): un compromesso tra "leggibile per un bel po'" e "non troppo veloce" (più il numero è vicino a 1, prima finisce la battitura)

  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    const top = container.getBoundingClientRect().top;
    const start = vh * START_VH;
    const end = vh * END_VH;
    let progress = (start - top) / (start - end);
    progress = Math.min(1, Math.max(0, progress)); // resta tra 0 e 1

    const visibleCount = Math.round(progress * chars.length);
    chars.forEach((span, i) => {
      span.classList.toggle("is-typed", i < visibleCount);
    });
    ticking = false;
  }

  function onScroll() {
    // Un solo calcolo per frame invece che a ogni singolo evento
    // "scroll" (che può scattare decine di volte al secondo)
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  update(); // stato corretto anche se la pagina si apre già scrollata
}


/* -----------------------------------------------------------------
   8. LIGHTBOX DELLA MINI GALLERIA
   Un clic su una foto della striscia apre l'unico blocco ".lightbox"
   (in index.html) a schermo intero con quella foto; le frecce (o i
   tasti ← →) passano a quella prima/dopo nell'elenco, in loop (dopo
   l'ultima si ricomincia dalla prima). Esc, la X o un clic sullo
   sfondo scuro chiudono.
   MODIFICA QUI: per aggiungere/togliere foto dalla galleria non
   serve toccare questa funzione, basta aggiungere/togliere un
   <img class="gallery-strip__img"> in index.html — l'elenco qui sotto
   si ricalcola da solo a ogni apertura.
----------------------------------------------------------------- */
function initGalleryLightbox() {
  const thumbs = document.querySelectorAll(".gallery-strip__img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  if (!thumbs.length || !lightbox || !lightboxImg) return;

  let current = 0;

  function show(index) {
    // "% length" con +length davanti gestisce anche gli indici
    // negativi (Prima sulla prima foto → torna all'ultima)
    current = (index + thumbs.length) % thumbs.length;
    lightboxImg.src = thumbs[current].src;
  }

  function open(index) {
    show(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-lightbox-open");
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-lightbox-open");
  }

  thumbs.forEach((img, i) => img.addEventListener("click", () => open(i)));
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (prevBtn) prevBtn.addEventListener("click", () => show(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => show(current + 1));

  // Un clic sullo sfondo scuro (non sulla foto o sulle frecce) chiude
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });
}


/* -----------------------------------------------------------------
   9. AVVIO
   Richiamiamo tutte le funzioni quando il DOM è pronto.
----------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initCustomCursor();
  initCursorTrail();
  initScrollReveal();
  initFooterYear();
  initHeaderScrollState();
  initScrollText();
  initGalleryLightbox();
});
