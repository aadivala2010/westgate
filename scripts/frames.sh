#!/usr/bin/env bash
# Regenerates the hero frame sequence from assets/mowing.mp4.
# Requires ffmpeg on PATH. Run from the repo root:  bash scripts/frames.sh
set -euo pipefail

SRC=assets/mowing.mp4
START=1.15      # mower enters frame ~1.2s; skip the empty lead-in
DURATION=3.75   # usable footage after START, ending as the mower exits right
COUNT=64        # keep in step with FRAME_COUNT in components/HeroSequence.tsx
RATE=$(awk "BEGIN{print $COUNT/$DURATION}")

# The mobile set is the binding constraint: it has a 3MB budget and it is what
# phones actually download. Everything below is the result of measuring, not
# taste. The headline finding was that resolution beats frame count — at a
# fixed budget you cannot see individual frames go by while scrubbing, but you
# can very much see a soft image. Hence 64 frames rather than 90, spent on
# pixels instead.
#
# Mobile at 780px wide, 64 frames: q68 -> 2.9MB, q70 -> 3.0MB, q72 -> 3.1MB (over).
# Desktop native 1800px, 64 frames: q62 -> 5.8MB, q66 -> 6.3MB.
Q_WIDE=62
Q_TALL=68

# Desktop: native crop, no downscale. This used to scale 1800 -> 1600 and then
# let the browser stretch it back up to ~1900 on a normal desktop, which was
# throwing away detail and paying for the privilege. At native width the same
# byte budget buys a visibly sharper frame.
# The 120px off the left and 60px off the top remove a watermark and an
# unstable treeline from the original footage.
WIDE_CROP="crop=w=1800:h=1020:x=120:y=60"

# Mobile: a portrait window that tracks the mower, then upscaled to 780px.
#
# 780 is not arbitrary: a 390px phone viewport at devicePixelRatio 2 (the cap in
# HeroSequence) is exactly 780 device pixels, so the canvas draws these 1:1 with
# no browser upscale at all. The crop itself is 470px of real detail, so the
# upscale is doing invented pixels either way — the point is to do it here with
# lanczos and a sharpening pass rather than leaving it to the GPU's bilinear
# filter at draw time, which is what read as blurry.
#
# The window has to move, because the mower crosses the whole frame. Its path
# was measured off the clip and is linear: x = 198 + 466*t (t from START, source
# pixels). Centring a 470px window on that gives the offset below, clamped to
# the frame so the mower holds near centre and exits right at the end.
TALL_CROP="crop=w=470:h=1020:x='clip(-37+466*t,0,1450)':y=60"

SHARPEN_WIDE="unsharp=5:5:0.7:3:3:0.4"
SHARPEN_TALL="unsharp=5:5:0.9:3:3:0.5"

rm -rf public/frames
mkdir -p public/frames/mobile

# fps before crop so `t` in the pan expression steps evenly with output frames.
# ffmpeg encodes webp directly; no jpeg intermediate to clean up.
ffmpeg -v error -ss $START -i "$SRC" -vf "fps=$RATE,$WIDE_CROP,$SHARPEN_WIDE" \
  -fps_mode passthrough -frames:v $COUNT \
  -c:v libwebp -quality $Q_WIDE -compression_level 6 -start_number 1 public/frames/f_%04d.webp

ffmpeg -v error -ss $START -i "$SRC" \
  -vf "fps=$RATE,$TALL_CROP,scale=780:-2:flags=lanczos,$SHARPEN_TALL" \
  -fps_mode passthrough -frames:v $COUNT \
  -c:v libwebp -quality $Q_TALL -compression_level 6 -start_number 1 public/frames/mobile/f_%04d.webp

mid=$(printf "%04d" $((COUNT / 2)))
cp "public/frames/f_$mid.webp" public/frames/poster.webp
cp "public/frames/mobile/f_$mid.webp" public/frames/mobile/poster.webp

desktop=$(du -cb public/frames/f_*.webp | tail -1 | cut -f1)
mobile=$(du -cb public/frames/mobile/f_*.webp | tail -1 | cut -f1)
echo "desktop: $(ls public/frames/f_*.webp | wc -l) frames, $(ffprobe -v error -show_entries stream=width,height -of csv=p=0 public/frames/f_0001.webp), $((desktop/1024))KB"
echo "mobile:  $(ls public/frames/mobile/f_*.webp | wc -l) frames, $(ffprobe -v error -show_entries stream=width,height -of csv=p=0 public/frames/mobile/f_0001.webp), $((mobile/1024))KB"

[ "$(ls public/frames/f_*.webp | wc -l)" -eq $COUNT ] || { echo "FAIL: wrong desktop frame count"; exit 1; }
[ "$mobile" -lt 3145728 ] || { echo "FAIL: mobile set is over the 3MB budget"; exit 1; }
