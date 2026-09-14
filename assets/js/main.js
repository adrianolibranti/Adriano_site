function initPreloader() {
  const preloader = document.getElementById("preloader");
  const countEl = document.getElementById("preloaderCount");
  if (!preloader || !countEl) return;

  document.body.classList.add("is-loading");

  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    countEl.textContent = Math.round(progress * 100);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      preloader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
    }
  }

  requestAnimationFrame(tick);
}

function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const caret = document.getElementById("cursorCaret");
  if (!cursor || !caret) return;

  if (window.matchMedia("(pointer: coarse)").matches) return;

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

  function buildTextRange(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let first = null;
    let last = null;
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      if (!first) first = node;
      last = node;
    }
    if (!first) return null;

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
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        if (fontSize) caret.style.setProperty("--caret-size", `${fontSize}px`);
      } else if (!overText && isActive) {
        isActive = false;
        cursor.classList.remove("is-text-hovering");
      }

      if (overText) {
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

function initCursorTrail() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cursor = document.getElementById("cursor");
  const GRID_SIZE = 42;
  const LIFETIME = 700;

  document.documentElement.style.setProperty("--grid-trail-size", `${GRID_SIZE}px`);

  let lastKey = null;

  window.addEventListener("mousemove", (e) => {
    if (cursor && cursor.classList.contains("is-text-hovering")) return;

    const cellX = Math.floor(e.clientX / GRID_SIZE) * GRID_SIZE;
    const cellY = Math.floor(e.clientY / GRID_SIZE) * GRID_SIZE;
    const key = cellX + "," + cellY;
    if (key === lastKey) return;
    lastKey = key;

    const cell = document.createElement("span");
    cell.className = "cursor-trail-cell";
    cell.style.transform = `translate(${cellX}px, ${cellY}px) scale(1)`;
    document.body.appendChild(cell);

    void cell.offsetWidth;

    cell.style.opacity = "0";
    cell.style.transform = `translate(${cellX}px, ${cellY}px) scale(0.7)`;

    setTimeout(() => cell.remove(), LIFETIME);
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initHeaderScrollState() {
  const THRESHOLD = 40;

  function updateState() {
    document.body.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
  }

  window.addEventListener("scroll", updateState, { passive: true });
  updateState();
}

function initScrollText() {
  const container = document.getElementById("scrollText");
  if (!container) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  const chars = [];

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

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    chars.forEach((c) => c.classList.add("is-typed"));
    return;
  }

  const START_VH = 1;
  const END_VH = 0.4;

  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    const top = container.getBoundingClientRect().top;
    const start = vh * START_VH;
    const end = vh * END_VH;
    let progress = (start - top) / (start - end);
    progress = Math.min(1, Math.max(0, progress));

    const visibleCount = Math.round(progress * chars.length);
    chars.forEach((span, i) => {
      span.classList.toggle("is-typed", i < visibleCount);
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

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
