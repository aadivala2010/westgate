#!/usr/bin/env bash
# Regenerates the hero frame sequence from assets/mowing.mp4.
# Requires ffmpeg on PATH. Run from the repo root:  bash scripts/frames.sh
set -euo pipefail

SRC=assets/mowing.mp4
START=1.15                              # mower enters frame ~1.2s; skip the empty lead-in
CROP="crop=w=1800:h=1020:x=120:y=60"    # strips the watermark (left) and jittery treeline (top)
RATE=24                                 # 24fps x 90 frames = 3.75s, ending as the mower exits right
COUNT=90
Q=72

rm -rf public/frames
mkdir -p public/frames/mobile

# ffmpeg encodes webp directly; no jpeg intermediate to clean up.
ffmpeg -v error -ss $START -i "$SRC" -vf "$CROP,fps=$RATE,scale=1600:-2" -fps_mode passthrough -frames:v $COUNT \
  -c:v libwebp -quality $Q -compression_level 6 -start_number 1 public/frames/f_%04d.webp
ffmpeg -v error -ss $START -i "$SRC" -vf "$CROP,fps=$RATE,scale=900:-2" -fps_mode passthrough -frames:v $COUNT \
  -c:v libwebp -quality $Q -compression_level 6 -start_number 1 public/frames/mobile/f_%04d.webp

cp public/frames/f_0045.webp public/frames/poster.webp

echo "desktop: $(ls public/frames/f_*.webp | wc -l) frames, $(du -cb public/frames/f_*.webp | tail -1 | cut -f1) bytes"
echo "mobile:  $(ls public/frames/mobile/f_*.webp | wc -l) frames, $(du -cb public/frames/mobile/f_*.webp | tail -1 | cut -f1) bytes"
