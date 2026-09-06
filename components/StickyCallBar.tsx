"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

/**
 * Fixed call/text bar under 768px. Hidden until the hero has scrolled away,
 * so it never covers the sequence. Watches a sentinel the page renders at the
 * end of the hero rather than measuring scroll position on every frame.
 */
export default function StickyCallBar({ sentinelId }: { sentinelId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;
    // Show only when the sentinel has left the viewport upwards. Testing
    // isIntersecting alongside the rect keeps the two edges consistent, so the
    // bar does not flicker as the sentinel crosses the top.
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [sentinelId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-stone/20 bg-ink/95 backdrop-blur-md transition-transform duration-200 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      // Off-screen when hidden, so it is skipped by tab order and screen readers.
      inert={!show ? true : undefined}
    >
      <a
        href={site.phone.tel}
        className="flex min-h-14 items-center justify-center bg-leaf font-medium text-ink"
      >
        Call Westgate
      </a>
      <a
        href={site.phone.sms}
        className="flex min-h-14 items-center justify-center border-l border-ink/20 bg-surface font-medium text-paper"
      >
        Text Westgate
      </a>
    </div>
  );
}
