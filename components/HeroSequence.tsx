"use client";

import { useEffect, useRef, useState } from "react";
import { heroLines, site } from "@/content/site";

const FRAME_COUNT = 90;
const PRELOAD = 12; // frames that must decode before the sequence is revealed
const MOBILE_MAX_WIDTH = 767; // below this we serve the 900px set

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const frameSrc = (i: number, mobile: boolean) =>
  `/frames${mobile ? "/mobile" : ""}/f_${String(i + 1).padStart(4, "0")}.webp`;

/**
 * Opacity for line `i` at scroll progress `p`. Each line owns the band between
 * the midpoints to its neighbours and cross-fades across the band edges. The
 * first line is already up at p=0 and the last one never fades out, so the
 * canvas is never wearing no copy at all.
 */
function lineOpacity(i: number, p: number) {
  const FADE = 0.07;
  const first = i === 0;
  const last = i === heroLines.length - 1;
  const inAt = first ? -Infinity : (heroLines[i - 1].at + heroLines[i].at) / 2;
  const outAt = last ? Infinity : (heroLines[i].at + heroLines[i + 1].at) / 2;
  const rising = first ? 1 : clamp01((p - inAt) / FADE);
  const falling = last ? 1 : clamp01((outAt - p) / FADE);
  return Math.min(rising, falling);
}

export default function HeroSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const posterRef = useRef<HTMLImageElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const mobile = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let cancelled = false;
    let lastDrawn = -1;
    let queued = false;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = -1; // force a redraw at the new size
    };

    /** Nearest loaded frame at or before `i`, so streaming never blanks out. */
    const resolve = (i: number) => {
      for (let j = i; j >= 0; j--) if (frames[j]) return j;
      for (let j = i + 1; j < FRAME_COUNT; j++) if (frames[j]) return j;
      return -1;
    };

    const draw = (index: number) => {
      const img = frames[index];
      if (!img) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      lastDrawn = index;
      // Reveal the canvas from the draw itself rather than via React state, so
      // the poster lifts on the exact frame that replaced it.
      if (posterRef.current) posterRef.current.style.opacity = "0";
    };

    const render = () => {
      queued = false;
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp01(-wrap.getBoundingClientRect().top / total) : 0;

      const target = resolve(Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1))));
      if (target >= 0 && target !== lastDrawn) draw(target);

      if (railRef.current) railRef.current.style.transform = `scaleX(${p})`;
      lineRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = String(lineOpacity(i, p));
      });
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(render);
    };

    const onResize = () => {
      sizeCanvas();
      onScroll();
    };

    sizeCanvas();

    // Preload the opening frames, then stream the rest one at a time so the
    // remaining requests never compete with the ones the user can already see.
    // Resolves on load, never rejects: one missing frame must not stall the
    // sequence. img.decode() is the obvious choice here and is the wrong one —
    // on a detached <img> it can hang forever in Chrome, which deadlocks the
    // whole preload. The load event is boring and it fires.
    const load = (i: number) =>
      new Promise<void>((done) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          frames[i] = img; // only ever set on success, so resolve() can trust it
          done();
        };
        img.onerror = () => done();
        img.src = frameSrc(i, mobile);
      });

    const stream = async (from: number) => {
      for (let i = from; i < FRAME_COUNT && !cancelled; i++) {
        await load(i);
        if (i === lastDrawn + 1) onScroll();
      }
    };

    Promise.all(Array.from({ length: PRELOAD }, (_, i) => load(i))).then(() => {
      if (cancelled) return;
      render();
      void stream(PRELOAD);
    });

    if (reduced) {
      // Static poster frame only; no scroll wiring, no streaming past the first.
      void load(FRAME_COUNT - 1).then(() => !cancelled && draw(FRAME_COUNT - 1));
      window.addEventListener("resize", onResize);
      return () => {
        cancelled = true;
        window.removeEventListener("resize", onResize);
      };
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <section
      ref={wrapRef}
      aria-label="Westgate Mowing"
      className={reduced ? "relative" : "relative h-[320svh]"}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-ink">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Aerial view of a mower cutting a striped lawn in low evening light."
        />

        {/* Poster holds the frame until frame 1 has decoded. The canvas is
            opaque, so this has to sit on top of it and fade out — underneath it
            would never be visible at all. */}
        <picture>
          <source media={`(max-width: ${MOBILE_MAX_WIDTH}px)`} srcSet="/frames/mobile/poster.webp" />
          <img
            src="/frames/poster.webp"
            alt=""
            aria-hidden="true"
            ref={posterRef}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          />
        </picture>

        {/* Legibility scrim, weighted to the bottom third where the copy and the
            rail sit. Kept off the upper frame so the footage still reads. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-ink) 88%, transparent) 0%, color-mix(in oklab, var(--color-ink) 45%, transparent) 24%, color-mix(in oklab, var(--color-ink) 12%, transparent) 50%, transparent 70%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-36 sm:px-10 sm:pb-44">
          <h1 className="sr-only">
            {site.name} — lawn care in Lancaster, Pennsylvania
          </h1>

          {/* All three lines are stacked in the same grid cell and cross-faded,
              so the block never changes height as the copy changes. */}
          <div className="grid grid-cols-1 grid-rows-1">
            {heroLines.map((line, i) => (
              <p
                key={line.text}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                style={reduced ? undefined : { opacity: i === 0 ? 1 : 0 }}
                className={
                  // max-width lives here, not on the wrapper: `ch` has to resolve against the
                  // display face, and the wrapper is still at body size.
                  "display col-start-1 row-start-1 max-w-[15ch] self-end text-[2.6rem] text-paper sm:text-6xl lg:max-w-[17ch] lg:text-7xl" +
                  (reduced ? " relative col-start-1 row-auto mb-6 opacity-100" : "")
                }
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>

        <a
          href={site.phone.tel}
          className="absolute right-5 bottom-8 rounded-full border border-leaf/50 bg-ink/70 px-5 py-3 text-sm font-medium text-leaf backdrop-blur-sm transition-colors hover:bg-leaf hover:text-ink sm:right-10"
        >
          Call <span className="tnum">{site.phone.display}</span>
        </a>

        {!reduced && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-stone/25">
            <div ref={railRef} className="h-px origin-left scale-x-0 bg-leaf" />
          </div>
        )}
      </div>
    </section>
  );
}
