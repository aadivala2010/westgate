# Westgate Mowing

Marketing site for Westgate Mowing — lawn care in Lancaster, Pennsylvania.

Next.js (App Router) + TypeScript + Tailwind CSS v4. No CMS, no database. Every
piece of copy and configuration lives in [`content/site.ts`](content/site.ts).
Deploy target is Vercel.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

There is deliberately **no quote calculator, price estimator, or pricing table**.
Pricing happens on the phone. Do not add one.

---

## Placeholders

Anything the client still has to confirm is wrapped in `{{ }}` and collected at
the top of `content/site.ts` under `PLACEHOLDERS`:

| Placeholder | What it is |
|---|---|
| `addressLocality`, `postalCode` | Used in the `LocalBusiness` JSON-LD. No street address is published anywhere on the site. |
| `hours` | Human-readable hours shown in the contact block |
| `openingHoursSpec` | The same hours in schema.org format (e.g. `Mo-Sa 07:00-18:00`) |

To find every remaining one:

```bash
grep -rn "{{" content/ app/ components/
```

Other things marked `TODO(client)` in the source:

- **The logo.** `public/logo-mark.png` is derived from a JPEG with a baked white
  background, so the header and the Open Graph card place it inside a white
  chip. Replace it with a transparent PNG or an SVG and the chip can go.
- **Testimonials.** All three quotes in `content/site.ts` are placeholder copy.
  Replace them with real, attributable quotes before launch.
- **Service radius.** The town list is a starting set of four; confirm the real
  coverage area.
- **Production domain.** `site.url` is assumed to be `westgatemowing.com`.

---

## Regenerating the hero frame sequence

The hero is a scroll-scrubbed canvas playing 90 WebP stills. The source video
lives in `assets/mowing.mp4`, which is **gitignored** — the generated frames in
`public/frames/` are what is committed.

```bash
bash scripts/frames.sh      # or: npm run frames
```

Requires `ffmpeg` on `PATH`. The script produces:

| Output | Size |
|---|---|
| `public/frames/f_0001–0090.webp` | 1600×906, ~4.6 MB total |
| `public/frames/mobile/f_0001–0090.webp` | 900×510, ~2.1 MB total |
| `public/frames/poster.webp`, `public/frames/mobile/poster.webp` | frame 45, shown until frame 1 loads |

The mobile set must stay **under 3 MB**. If a new clip pushes it over, lower `Q`
or `COUNT` in the script until it fits, and update `FRAME_COUNT` in
`components/HeroSequence.tsx` to match if you change the count.

Knobs at the top of `scripts/frames.sh`:

- `START` — the current clip has ~1.2s of empty grass before the mower enters
  frame, so extraction starts at 1.15s. A different clip will need a different
  value.
- `CROP` — `1800×1020` at offset `120,60`, which removes a watermark on the left
  and an unstable treeline along the top.
- `RATE` × `COUNT` must cover the usable length of the clip (currently
  24fps × 90 = 3.75s).

**After regenerating, look at the frames before shipping.** The script cannot
tell you whether the crop still clears the watermark or whether the subject is
in shot for the whole sequence.

### How the hero works

`components/HeroSequence.tsx`: a ~320svh container with a `position: sticky`
full-viewport canvas inside it. Scroll progress through the container maps to a
frame index; drawing is cover-fit at `devicePixelRatio` capped at 2, throttled
through `requestAnimationFrame`, never synchronous in the scroll handler. The
first 12 frames are preloaded before the sequence takes over from the poster;
the remaining 78 stream in sequentially.

Viewports under 768px get the 900px set via a `matchMedia` check on the source
path. With `prefers-reduced-motion: reduce` the container collapses to one
viewport height, no scroll listener is attached, and a single static frame is
drawn.

One note if you touch the loader: it uses the image `load` event rather than
`img.decode()`. `decode()` is the more obvious API and it can hang forever on a
detached `<img>` in Chrome, which deadlocks the whole preload.

---

## Adding a service-area town

Append to `towns` in `content/site.ts`:

```ts
{
  slug: "east-petersburg",
  name: "East Petersburg",
  blurb: "Two or three real sentences about this town specifically…",
}
```

That is the only edit. The static page at `/service-area/east-petersburg`, the
sitemap entry, the `areaServed` entry in the JSON-LD, the homepage list and the
footer links all derive from that array.

The blurb is the whole point of these pages — write something true about that
town's properties. One paragraph with the name swapped is worse than no page.

---

## Adding a before/after pair

1. Drop two images in `public/work/`. Both halves of a pair must share the same
   aspect ratio, and should be the same scene from the same position.
2. Append to `workPairs` in `content/site.ts` with `width`/`height` (the intrinsic
   size, used to reserve space so nothing shifts) and real alt text for each.

The comparison slider picks up any number of pairs and renders a selector above
the image once there is more than one.

If you are splitting a supplied side-by-side composite into two halves,
`scripts/work-images.sh` does that for the current pair and documents the crop
geometry — adjust the offsets for a new source.

Note the current photos are only 476px per half, so the slider is capped at
620px wide. Higher-resolution originals would let that cap rise.

---

## Contact form

`app/api/contact/route.ts` validates the submission and **logs it, nothing
more**. Before launch, wire one or both of:

- **Resend** — email the lead to `site.email`
- **Twilio** — SMS the lead to `site.phone.e164`

Both are marked with `TODO(wiring)` in the route, and both need environment
variables set in Vercel. Until that is done a submitted form is only as durable
as the function log, so do not launch on it. The call and text links are the
primary path regardless.

---

## Design notes

Tokens are defined once in `app/globals.css` under `@theme`:

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0C110D` | Page background |
| `--color-surface` | `#141A15` | Lifted panels, alternating sections |
| `--color-leaf` | `#6DB26C` | Accent — sampled from the logo's light stroke |
| `--color-moss` | `#4D814B` | Structural accent — sampled from the logo's dark stroke |
| `--color-paper` | `#F4F5F2` | Primary text |
| `--color-stone` | `#8E9A8C` | Secondary text |

Both greens are sampled directly from `assets/logo.jpeg`. Do not eyeball
replacements.

Contrast on `--color-ink`: paper 17.6:1, stone 6.5:1, leaf 7.5:1, **moss 4.1:1**.
Moss does not clear 4.5:1 — it is for rules, borders and numerals only and must
never carry body text.

Type is Instrument Serif for display (set large and tight) and Archivo for body
and UI, both via `next/font`. The logo wordmark is a heavy geometric sans; the
page deliberately does not try to match it.

Motion is limited to the hero scrub plus user-initiated state changes (the
mobile menu, the comparison slider). `prefers-reduced-motion` is respected
globally in `app/globals.css` and specifically in the hero.

A static bar above the header carries `bannerText` from `content/site.ts`, set
uppercase in CSS — write the value in sentence case. The bar is 36px and the
header bar 64px, so anything positioned against the header assumes a total of
100px (`scroll-padding-top` is 7rem, the mobile menu opens at `top-25`).
