import { heroLines, site } from "@/content/site";

/**
 * Looping hero video under a dark scrim. No scroll wiring, no client component:
 * the browser's own autoplay/loop attributes do all of it.
 *
 * `muted` and `playsInline` are not decoration — without both, mobile Safari and
 * Chrome refuse to autoplay at all. The poster covers the gap before the first
 * frame decodes, so the section is never a black hole on a slow connection.
 */
export default function Hero() {
  return (
    <section aria-label={site.name} className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="/hero-poster.webp"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        {/* VP9 first: grass is fine high-contrast detail, the hardest thing
            there is to compress, and VP9 holds it at roughly half h.264's size.
            The mp4 is the fallback for anything that will not take WebM. */}
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Shading. Weighted to the bottom where the copy sits, with a light wash
          over the whole frame so white type holds up against moving footage. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--color-ink) 92%, transparent) 0%, color-mix(in oklab, var(--color-ink) 62%, transparent) 26%, color-mix(in oklab, var(--color-ink) 34%, transparent) 55%, color-mix(in oklab, var(--color-ink) 28%, transparent) 100%)",
        }}
      />

      <div className="relative px-5 pt-40 pb-20 sm:px-10 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <h1 className="display max-w-[15ch] text-[2.9rem] text-paper sm:text-6xl lg:max-w-[17ch] lg:text-7xl">
            {heroLines[0].text}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-stone sm:mt-8">
            {heroLines[1].text} {heroLines[2].text}
          </p>

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
    </section>
  );
}
