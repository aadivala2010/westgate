import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import { bannerText, navLinks, site } from "@/content/site";

function QuoteBanner() {
  return (
    <div className="flex h-9 items-center justify-center border-b border-moss/40 bg-surface">
      <span className="text-[0.68rem] tracking-[0.18em] text-stone uppercase">{bannerText}</span>
    </div>
  );
}

/** Server component. The mobile menu is split out because it needs handlers. */
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <QuoteBanner />
      <div className="flex h-16 border-b border-stone/15 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-10">
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

        <MobileMenu />
        </div>
      </div>
    </header>
  );
}
