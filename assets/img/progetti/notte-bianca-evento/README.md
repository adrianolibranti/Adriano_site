# Asset — Notte Bianca (Evento)

Metti qui gli asset reali del progetto "Notte Bianca" (progetto-notte-bianca.html).

- `cover.jpg` — immagine di copertina (16:9), anche anteprima nella
  card in eventi.html
- `video.mp4` — il video dell'evento. Quando ce l'hai, in
  progetto-notte-bianca.html sostituisci il blocco `.project-video`
  segnaposto con:
  ```html
  <video class="project-video" controls poster="assets/img/progetti/notte-bianca-evento/cover.jpg">
    <source src="assets/img/progetti/notte-bianca-evento/video.mp4" type="video/mp4">
  </video>
  ```
  (oppure incolla l'embed di YouTube/Vimeo al posto del `<video>`,
  mantenendo la classe "project-video" per lo stesso aspect-ratio 16:9)

Finché non ci sono asset veri, il sito mostra un segnaposto con
icona "play" (nessun file mancante da temere).
