#!/usr/bin/env bash
# Encodes everything in assets/ that the site serves out of public/. Run from
# the repo root after adding or replacing a source photo.
set -euo pipefail

# Hero and service-area map: native size, no crop.
ffmpeg -v error -i assets/bg.jpeg    -quality 68 -y public/bg.webp
ffmpeg -v error -i assets/areas.jpeg -vf scale=900:-1 -quality 76 -y public/areas.webp

# Before/after pair. The two shots are handheld, so they differ by a few pixels
# in height — both are cropped to the shorter one so the wipe stays registered.
for half in b:before a:after; do
  ffmpeg -v error -i "assets/${half%%:*}1.jpeg" \
    -vf "crop=1170:2057:0:0,scale=760:-1" -quality 72 -y \
    "public/work/ba1-${half##*:}.webp"
done

# Service cards. Sources are every shape from square to panorama, so each is
# centre-cropped to 4:3 — the cards sit in one grid and must match.
for s in mowing leaf snow hedge edging; do
  ffmpeg -v error -i "assets/$s.jpeg" \
    -vf "crop='min(iw,ih*4/3)':'min(ih,iw*3/4)',scale=800:600" -quality 76 -y \
    "public/services/$s.webp"
done

ls -l public/*.webp public/work public/services
