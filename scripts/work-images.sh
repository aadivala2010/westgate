#!/usr/bin/env bash
# Splits the supplied side-by-side before/after composites in assets/ into
# separate halves for the comparison slider. Run from the repo root.
# The source JPEGs are 960x359 with a 5px divider at x=477 and a baked-in
# caption bar below y=302 — both are cropped away.
set -euo pipefail

for n in 1 2; do
  ffmpeg -v error -i "assets/ba$n.jpg" -vf "crop=w=476:h=280:x=0:y=0"   -quality 82 -y "public/work/ba$n-before.webp"
  ffmpeg -v error -i "assets/ba$n.jpg" -vf "crop=w=476:h=280:x=482:y=0" -quality 82 -y "public/work/ba$n-after.webp"
done
ls -l public/work/*.webp
