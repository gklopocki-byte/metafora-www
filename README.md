# metafora-www – strona Metafora Architekci (serwer testowy new.metaforaarchitekci.pl)

Od 18.11.2026 w katalogu głównym jest **New M Metafora** (wersja w stylu Norm) – na niej pracujemy dalej.

- `index.html`, `assets/` (site.css, site.js, projekty.js), `img/`, `fonts/`, `video/`, `p/<id>/` – nowa strona.
- `assets/projekty.js` – dane projektów. `x:1` = projekt ukryty (36 projektów przeniesionych ze starej strony czeka na opracowanie; usuń `x`, żeby pokazać). Pole `t2` – typ w menu Prace.
- `stara/` – ARCHIWUM poprzedniej strony (do porównania: new.metaforaarchitekci.pl/stara/). Nie rozwijamy jej.
- `_tymczasowa/` + `.github/workflows/deploy-tymczasowa.yml` – strona tymczasowa na metaforaarchitekci.pl (bez zmian).

Wrzucanie: commit + push na main (aplikacja GitHub Copilot na Macu) → serwer odświeża się w 1–2 min. Tylko po haśle „wrzucamy” / wyraźnym poleceniu Grzegorza.
