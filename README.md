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

## The hero

`components/Hero.tsx` draws the hero scene as a single inline SVG — a striped
lawn in one-point perspective under a tree line — so it is resolution
independent, ships no image bytes and needs no JavaScript. Geometry knobs are
the constants at the top of the file (`VP`, `STRIPES`, `SPAN`, `GROUND`);
colours are the gradient stops, which use the same tokens as the rest of the
site.

Scrolling drives the mow: the mower crosses the field, the stripes appear
behind it and the progress rail fills. That is three CSS animations on one
native `view-timeline` declared in `globals.css`, not a scroll listener — the
hero is a server component. Browsers without scroll timelines, and anyone who
asks for reduced motion, get a one-viewport hero showing the finished state,
which is what the SVG's own attributes say.

The scroll-scrubbed video frame sequence this replaced is gone, along with
`scripts/frames.sh` and the 9 MB of WebP stills in `public/frames/`.

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

There is no backend. The form builds a message from the fields and hands it to
the visitor's own mail or messages app through a `mailto:` / `sms:` link. They
press send there, so it goes out from their address or number and lands in their
sent folder. Nothing to configure, no API key, no third-party service, and no
route that can quietly stop working.

Both buttons live in `components/ContactForm.tsx`; the message templates are the
two arrays in `compose()`.

Two things worth knowing:

- **A desktop with no mail client configured does nothing when the `mailto:`
  fires**, silently. The note under the buttons points back at the phone number
  for exactly this case.
- The SMS link uses `sms:+1...?&body=`. The `?&` is deliberate — iOS and Android
  disagree on the separator and this is the form both accept. Do not "tidy" it
  to `?body=`.

The call and text links elsewhere on the page are the primary path regardless.

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
