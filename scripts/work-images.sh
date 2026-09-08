#!/usr/bin/env bash
# Encodes the supplied before/after photos in assets/ for the comparison slider.
# Run from the repo root. The two shots are handheld, so they differ by a few
# pixels in height — both are cropped to the shorter one and scaled to the same
# size, otherwise the wipe would not stay registered.
set -euo pipefail

for n in 1; do
  for half in b:before a:after; do
    ffmpeg -v error -i "assets/${half%%:*}$n.jpeg" \
      -vf "crop=1170:2057:0:0,scale=760:-1" -quality 72 -y \
      "public/work/ba$n-${half##*:}.webp"
  done
done
ls -l public/work/*.webp
