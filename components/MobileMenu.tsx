"use client";

import { useRef } from "react";
import { navLinks, site } from "@/content/site";

/**
 * The mobile menu, still a <details> so it opens and is keyboard operable
 * natively. What <details> does not give you is closing: tapping a link jumps
 * to the section but leaves the panel sitting over it, and neither Escape nor
 * a tap outside dismisses it. Hence the three handlers below.
 */
export default function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  return (
    <details
      ref={ref}
      className="group relative md:hidden"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md text-paper [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Open menu</span>
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" fill="none">
          <path
            d="M3 6h16M3 11h16M3 16h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            className="group-open:hidden"
          />
          <path
            d="M5 5l12 12M17 5L5 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            className="hidden group-open:block"
          />
        </svg>
      </summary>

      {/* Catches taps outside the panel, and stops them landing on whatever
          sits underneath. Behind the panel, above the page. Sized with h-dvh
          rather than bottom-0: the containing block is only the header bar, so
          bottom-0 would collapse it to nothing. */}
      <div
        aria-hidden="true"
        onClick={close}
        className="fixed inset-x-0 top-full hidden h-dvh bg-ink/60 group-open:block"
      />

      {/* top-full, not a fixed offset: the header's backdrop-blur makes it the
          containing block for fixed descendants, so 100% here is exactly the
          height of the header bar and the panel hangs off its bottom edge. */}
      <nav
        aria-label="Primary"
        onClick={close}
        className="fixed inset-x-0 top-full border-b border-stone/15 bg-ink px-5 pt-2 pb-6"
      >
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} className="block rule-b py-4 text-lg text-paper first:border-t-0">
            {l.label}
          </a>
        ))}
        <a
          href={site.phone.tel}
          className="mt-6 block bg-leaf px-5 py-4 text-center font-medium text-ink"
        >
          Call <span className="tnum">{site.phone.display}</span>
        </a>
      </nav>
    </details>
  );
}
