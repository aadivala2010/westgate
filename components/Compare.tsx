"use client";

import { useState } from "react";
import { workPairs } from "@/content/site";

/**
 * Before/after wipe. The control is a real <input type="range"> stretched over
 * the image and made invisible, which buys pointer drag, touch drag, click-to-
 * jump, arrow keys, Home/End and screen-reader semantics without a line of
 * gesture code. The visible handle is drawn from its value.
 */
export default function Compare() {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const pair = workPairs[active];

  return (
    <div>
      {workPairs.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          {workPairs.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setActive(i);
                setPos(50);
              }}
              aria-pressed={i === active}
              className={`cursor-pointer border-b py-1 text-sm transition-colors ${
                i === active
                  ? "border-leaf text-paper"
                  : "border-transparent text-stone hover:text-paper"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* The photos are portrait, so the cap is on width to keep the frame
          from running taller than the viewport on a desktop column. */}
      <div
        className="relative w-full max-w-[420px] overflow-hidden bg-surface select-none"
        style={{ aspectRatio: `${pair.width} / ${pair.height}` }}
      >
        {workPairs.map((p, i) => (
          <div key={p.id} hidden={i !== active} className="absolute inset-0">
            <img
              src={p.after}
              alt={p.afterAlt}
              width={p.width}
              height={p.height}
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Both images fill the frame; the wipe is a clip, so the two stay
                pixel-registered no matter where the handle sits. */}
            <img
              src={p.before}
              alt={p.beforeAlt}
              width={p.width}
              height={p.height}
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              style={{ clipPath: `inset(0 ${100 - (i === active ? pos : 50)}% 0 0)` }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}

        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Reveal the before and after of ${pair.label}. Drag left for before, right for after.`}
          className="peer absolute inset-0 z-20 h-full w-full cursor-col-resize appearance-none bg-transparent opacity-0"
        />

        <div
          aria-hidden="true"
          style={{ left: `${pos}%` }}
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-current text-paper peer-focus-visible:w-[3px] peer-focus-visible:text-leaf"
        >
          <span className="absolute top-1/2 left-1/2 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current bg-ink/50 backdrop-blur-[2px]" />
        </div>

        <span className="pointer-events-none absolute bottom-3 left-3 z-10 bg-ink/75 px-2 py-1 text-xs tracking-wide text-paper">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 bottom-3 z-10 bg-ink/75 px-2 py-1 text-xs tracking-wide text-paper">
          After
        </span>
      </div>
    </div>
  );
}
