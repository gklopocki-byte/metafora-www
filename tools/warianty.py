#!/usr/bin/env python3
"""Mniejsze wersje WebP zdjęć strony (srcset) – Metafora Architekci.
Uruchom w katalogu strony:  python3 tools/warianty.py [limit_sekund]
Dla każdego p/<projekt>/NN.jpg tworzy NN-800.webp i NN-1200.webp,
dla 01.jpg także 01-1800.webp, dla t.jpg: t-600.webp i t-1000.webp.
Największą wersją w srcset jest sam JPG (strona sama to obsługuje).
Wersja nigdy nie jest większa od oryginału. Pomija pliki aktualne (webp nowszy od jpg),
więc po dodaniu projektu albo podmianie zdjęcia wystarczy uruchomić skrypt ponownie.
"""
import os, re, sys, time
from PIL import Image, ImageOps
LIMIT = float(sys.argv[1]) if len(sys.argv) > 1 else 1e9
T0 = time.time(); ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "p")
G = [800, 1200]; H = G + [1800]; TT = [600, 1000]
done = todo = 0
jobs = []
for d in sorted(os.listdir(ROOT)):
    pd = os.path.join(ROOT, d)
    if not os.path.isdir(pd): continue
    for f in sorted(os.listdir(pd)):
        m = re.fullmatch(r"(\d+|t)\.jpg", f)
        if not m: continue
        n = m.group(1); ws = TT if n == "t" else (H if n == "01" else G)
        src = os.path.join(pd, f); mt = os.path.getmtime(src)
        need = [w for w in ws if not (os.path.exists(os.path.join(pd, f"{n}-{w}.webp")) and os.path.getmtime(os.path.join(pd, f"{n}-{w}.webp")) >= mt)]
        if need: jobs.append((pd, n, src, need))
for pd, n, src, need in jobs:
    if time.time() - T0 > LIMIT: todo += 1; continue
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB"); W, Hh = im.size
    for w in need:
        tw = min(w, W); out = im if tw == W else im.resize((tw, round(Hh * tw / W)), Image.LANCZOS)
        out.save(os.path.join(pd, f"{n}-{w}.webp"), "WEBP", quality=80, method=4)
    done += 1
print(f"zrobione: {done}, zostało: {todo}")
