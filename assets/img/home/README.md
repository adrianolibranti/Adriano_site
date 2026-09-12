# Asset — Homepage (foto fisse + galleria)

- `hero-side.jpg`, `about-side.jpg` — foto **di prova/segnaposto** (da
  Lorem Picsum, libere da usare come placeholder), a destra della Hero
  e di "Chi sono". MODIFICA QUI: sostituisci con una foto vera tua
  mantenendo lo stesso nome — il trattamento in bianco e nero via CSS
  resta valido anche con foto vere.
- `gallery-NN.jpg` — foto vere (ridimensionate a 1600px sul lato lungo
  e ricompresse per il web: gli originali, alcuni oltre 30MB,
  avrebbero appesantito troppo la pagina). La numerazione non è per
  forza continua (alcune sono state tolte): non importa, in index.html
  c'è un `<img>` per ogni file davvero presente qui. Mosaico sotto il
  carosello loghi: qualche foto è "grande" (classe
  `gallery-strip__img--big` in index.html, sparsa per dare ritmo alla
  griglia). Un clic apre la foto a schermo intero nel lightbox (vedi
  ".lightbox" in style.css e initGalleryLightbox() in main.js), da cui
  si scorre avanti/indietro. Per aggiungere/togliere una foto: metti/
  cancella il file qui E aggiungi/cancella la riga `<img
  class="gallery-strip__img" src="assets/img/home/gallery-NN.jpg">`
  corrispondente in index.html — il lightbox si aggiorna da solo, non
  serve toccare main.js.
