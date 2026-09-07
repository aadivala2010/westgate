import { hero, site } from "@/content/site";

/* Vector scene, drawn once at build time. Everything below is a flat SVG on a
   1600×900 stage, slice-fitted, so it stays sharp at any viewport or DPR —
   which the frame sequence it replaced could not do.

   The mowing pass is scroll-driven, but there is no JavaScript here: the hero
   is a native `view-timeline` and the mower, the cut mask and the progress rail
   are three CSS animations bound to it (see `globals.css`). Where scroll
   timelines are not supported, or motion is not wanted, the markup's own
   attributes stand as the end state: lawn cut, mower parked off-frame.

   Perspective: every stripe is a triangle from the bottom edge to the vanishing
   point, so the convergence is real rather than eyeballed. */
const VP = { x: 800, y: 372 } as const; // vanishing point, sitting on the horizon
const STRIPES = 17;
const SPAN = { from: -900, to: 2500 } as const; // stripe fan at the bottom edge
const GROUND = 760; // y the mower's wheels ride on

const stripes = Array.from({ length: STRIPES }, (_, i) => {
  const w = (SPAN.to - SPAN.from) / STRIPES;
  const x = SPAN.from + i * w;
  return { key: i, points: `${x},900 ${x + w},900 ${VP.x},${VP.y}`, cut: i % 2 === 0 };
});

/* Mower: Tabler Icons `lawn-mower`, MIT (tabler.io/icons). The icon is a 24×24
   line drawing, so it is blown up ~8× and its stroke divided back down — at
   scale the 2-unit icon stroke would land as a 16px slab. Drawn around x=0 at
   wheel height, which is where the cut mask's edge is, so the stripes appear
   exactly under the deck. */
const SCALE = 8;
const ICON = { midX: 12, groundY: 20 } as const; // icon-space centre line and wheel bottom

function Mower() {
  return (
    <g className="hero-mower" transform="translate(1760 0)">
      {/* Clippings thrown out behind the machine. */}
      <g fill="#6db26c" fillOpacity="0.3">
        <circle cx="-128" cy={GROUND - 10} r="5" />
        <circle cx="-152" cy={GROUND - 26} r="3.5" />
        <circle cx="-142" cy={GROUND + 4} r="3" />
      </g>

      <g
        transform={`translate(${-ICON.midX * SCALE} ${GROUND - ICON.groundY * SCALE}) scale(${SCALE})`}
        fill="none"
        stroke="#6db26c"
        strokeWidth={0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 11h5.38a1 1 0 0 1 .9.55L13 13h5a1 1 0 0 1 1 1v2" />
        <path d="M3 4h1.13a1 1 0 0 1 1 .86L6.72 16M17 18H9" />
        <path d="M9 18a2 2 0 1 1-4 0a2 2 0 0 1 4 0m12 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0" />
      </g>
    </g>
  );
}

function Scene() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Illustration of a mower cutting a lawn into stripes, running to a tree line at dusk."
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f0b" />
          <stop offset="70%" stopColor="#131c14" />
          <stop offset="100%" stopColor="#1d2c1c" />
        </linearGradient>
        {/* Low sun behind the tree line: the only warm thing in the frame. */}
        <radialGradient id="glow" cx="0.5" cy="1" r="0.75">
          <stop offset="0%" stopColor="#6db26c" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#4d814b" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4d814b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="turf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22371f" />
          <stop offset="45%" stopColor="#2c4a29" />
          <stop offset="100%" stopColor="#1a2a19" />
        </linearGradient>
        {/* Haze that swallows the stripes as they crowd together at the horizon,
            where a hard convergence would alias into moiré. */}
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d2c1c" stopOpacity="1" />
          <stop offset="100%" stopColor="#1d2c1c" stopOpacity="0" />
        </linearGradient>
        {/* Bottom weight: hands the copy its contrast without dimming the scene. */}
        <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c110d" stopOpacity="0" />
          <stop offset="55%" stopColor="#0c110d" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0c110d" stopOpacity="0.94" />
        </linearGradient>

        {/* Everything the mower has already passed. The rect's width is what
            scroll actually animates; the attribute below is the finished state. */}
        <mask id="cut">
          <rect className="hero-cut" width="1600" height="900" fill="#fff" />
        </mask>
      </defs>

      <rect width="1600" height="380" fill="url(#sky)" />
      <ellipse cx="800" cy="380" rx="760" ry="240" fill="url(#glow)" />

      {/* Tree line. Hand-drawn bumps rather than generated noise, so the
          silhouette reads as trees and not as a sawtooth. */}
      <path
        d="M0 380 V352 q34-30 62-6 26-40 58-12 18-34 46-14 30-38 66-4 22-30 52-6 26-34 60-8 30-32 58 2 24-36 54-4 28-40 62-2 20-32 50-8 30-34 60 2 24-30 54-2 26-36 58-6 22-28 48 6 30-32 58 0 26-30 56 4 22-26 46 10 V380 Z"
        fill="#0a0f0b"
      />

      <rect y="372" width="1600" height="528" fill="url(#turf)" />

      {/* Uncut grass is the flat turf above; the stripes only exist inside the
          mask, so the cut follows the machine across the field. */}
      <g mask="url(#cut)">
        {stripes.map((s) => (
          <polygon
            key={s.key}
            points={s.points}
            fill={s.cut ? "#6db26c" : "#0c110d"}
            fillOpacity={s.cut ? 0.11 : 0.16}
          />
        ))}
      </g>

      <rect y="372" width="1600" height="230" fill="url(#haze)" />
      {/* The mower's last pass: one lit edge where the deck left the grass. */}
      <path d="M0 380 H1600" stroke="#6db26c" strokeOpacity="0.28" strokeWidth="2" />

      <Mower />

      <rect y="380" width="1600" height="520" fill="url(#scrim)" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section aria-label={site.name} className="hero relative bg-ink">
      <div className="hero-stage relative flex min-h-svh flex-col justify-end overflow-hidden">
        <Scene />

        <div className="relative px-5 pt-40 pb-20 sm:px-10 sm:pb-28">
          <div className="mx-auto max-w-6xl">
            <h1 className="display max-w-[15ch] text-[2.9rem] text-paper sm:text-6xl lg:max-w-[17ch] lg:text-7xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg text-stone sm:mt-8">{hero.lede}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={site.phone.tel}
                className="flex min-h-14 items-center justify-center bg-leaf px-7 text-lg font-medium text-ink transition-colors hover:bg-paper"
              >
                Call <span className="tnum ml-2">{site.phone.display}</span>
              </a>
              <a
                href="#contact"
                className="flex min-h-14 items-center justify-center border border-stone/40 px-7 text-lg font-medium text-paper transition-colors hover:border-leaf hover:text-leaf"
              >
                Get a free quote
              </a>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-stone/25">
          <div className="hero-rail h-px origin-left scale-x-0 bg-leaf" />
        </div>
      </div>
    </section>
  );
}
