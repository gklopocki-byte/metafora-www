# metafora-www – strona Metafora Architekci (serwer testowy new.metaforaarchitekci.pl)

Od 18.11.2026 w katalogu głównym jest **New M Metafora** (wersja w stylu Norm) – na niej pracujemy dalej.

- `index.html`, `assets/` (site.css, site.js, projekty.js), `img/`, `fonts/`, `video/`, `p/<id>/` – nowa strona.
- `assets/projekty.js` – dane projektów. `x:1` = projekt ukryty (36 projektów przeniesionych ze starej strony czeka na opracowanie; usuń `x`, żeby pokazać). Pole `t2` – typ w menu Prace.
- Stara strona (archiwum) NIE jest już w repo ani na serwerze – leży lokalnie w `~/Documents/metafora-www-ukryte/stara/` (decyzja 18.11.2026).
- `_tymczasowa/` + `.github/workflows/deploy-tymczasowa.yml` – strona tymczasowa na metaforaarchitekci.pl (bez zmian).

Wrzucanie: commit + push na main (aplikacja GitHub Copilot na Macu) → serwer odświeża się w 1–2 min. Tylko po haśle „wrzucamy” / wyraźnym poleceniu Grzegorza.

## Zdjęcia w kilku rozmiarach (WebP, srcset) – od 18.11.2026
- Po dodaniu projektu albo podmianie zdjęć w `p/<projekt>/` uruchom w katalogu strony: `python3 tools/warianty.py`.
- Skrypt dorabia brakujące `NN-800.webp`, `NN-1200.webp` (dla `01` także `01-1800.webp`) oraz `t-600.webp`, `t-1000.webp`. Aktualnych nie rusza.
- Największą wersją jest zawsze oryginalny JPG. Przeglądarka sama wybiera rozmiar (telefon mniejszy, monitor większy).
- `assets/site.js` na serwerze ma `const SRCSET=true;` (podgląd Claude: `false`).
