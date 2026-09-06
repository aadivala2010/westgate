#!/usr/bin/env bash
# Regenerates the hero frame sequence from assets/mowing.mp4.
# Requires ffmpeg on PATH. Run from the repo root:  bash scripts/frames.sh
set -euo pipefail

SRC=assets/mowing.mp4
START=1.15   # mower enters frame ~1.2s; skip the empty lead-in
RATE=24      # 24fps x 90 frames = 3.75s, ending as the mower exits right
COUNT=90

# Quality was picked off a sweep, at the knee of each curve. Desktop: 72->5.5MB,
# 75->5.8MB, 78->6.7MB, so 75 is the last cheap step. Mobile: 78->2.1MB,
# 82->2.6MB, 84->3.1MB, which is already over budget, so 82 takes the headroom
# without spending it all.
Q_WIDE=75
Q_TALL=82

# Desktop: the full landscape shot. 120px off the left and 60px off the top
# remove a watermark and an unstable treeline from the original footage.
WIDE_CROP="crop=w=1800:h=1020:x=120:y=60"

# Mobile: a portrait crop that tracks the mower.
#
# A phone hero is roughly 0.46 aspect, so cover-fitting the landscape frame threw
# away about three quarters of its width and stretched the surviving sliver — the
# source was doing ~240px of real detail across a 390px viewport. Cropping a
# portrait window instead means every pixel encoded is a pixel shown.
#
# The window has to move, because the mower crosses the whole frame. Its position
# was measured off the clip and is linear: x = 198 + 466*t (t from START, source
# pixels). Centring the 470px window on that gives the offset below, clamped to
# the frame so the mower drifts to the right and exits at the end rather than
# sticking to the middle.
TALL_CROP="crop=w=470:h=1020:x='clip(-37+466*t,0,1450)':y=60"

rm -rf public/frames
mkdir -p public/frames/mobile

# fps before crop so `t` in the pan expression steps evenly with output frames.
# ffmpeg encodes webp directly; no jpeg intermediate to clean up.
ffmpeg -v error -ss $START -i "$SRC" -vf "fps=$RATE,$WIDE_CROP,scale=1600:-2" \
  -fps_mode passthrough -frames:v $COUNT \
  -c:v libwebp -quality $Q_WIDE -compression_level 6 -start_number 1 public/frames/f_%04d.webp

# No scale on the mobile set: 470x1020 is the real detail available in that
# window, and upsampling it would only spend bytes on invented pixels.
ffmpeg -v error -ss $START -i "$SRC" -vf "fps=$RATE,$TALL_CROP" \
  -fps_mode passthrough -frames:v $COUNT \
  -c:v libwebp -quality $Q_TALL -compression_level 6 -start_number 1 public/frames/mobile/f_%04d.webp

cp public/frames/f_0045.webp public/frames/poster.webp
cp public/frames/mobile/f_0045.webp public/frames/mobile/poster.webp

desktop=$(du -cb public/frames/f_*.webp | tail -1 | cut -f1)
mobile=$(du -cb public/frames/mobile/f_*.webp | tail -1 | cut -f1)
echo "desktop: $(ls public/frames/f_*.webp | wc -l) frames, $((desktop/1024))KB"
echo "mobile:  $(ls public/frames/mobile/f_*.webp | wc -l) frames, $((mobile/1024))KB"
[ "$mobile" -lt 3145728 ] || { echo "FAIL: mobile set is over the 3MB budget"; exit 1; }
