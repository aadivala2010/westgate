import Link from "next/link";
import { navLinks, site } from "@/content/site";

/**
 * Server component. The mobile menu is a <details> element rather than React
 * state — it opens, closes on Escape, and is keyboard operable natively.
 */
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone/15 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          {/* TODO(client): swap for a transparent PNG/SVG and drop the chip.
              The supplied logo is a JPEG with a baked white background. */}
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white p-1">
            <img
              src="/logo-mark.png"
              alt=""
              width={320}
              height={320}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-[0.95rem] font-semibold tracking-tight text-paper">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-stone transition-colors hover:text-paper"
            >
              {l.label}
            </a>
          ))}
          <a
            href={site.phone.tel}
            className="border-b border-leaf pb-0.5 text-sm font-medium text-leaf transition-colors hover:text-paper"
          >
            Call <span className="tnum">{site.phone.display}</span>
          </a>
        </nav>

        <details className="group relative md:hidden">
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
          <nav
            aria-label="Primary"
            className="fixed inset-x-0 top-16 border-b border-stone/15 bg-ink px-5 pt-2 pb-6"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block rule-b py-4 text-lg text-paper first:border-t-0"
              >
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
      </div>
    </header>
  );
}
