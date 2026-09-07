import Link from "next/link";
import { site, towns } from "@/content/site";

/** Shared by the home page, the town pages and the 404, so no page dead-ends. */
export default function Footer() {
  return (
    <footer className="rule-t bg-surface py-14 pb-28 md:pb-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <div>
          <Link href="/" className="display text-2xl text-paper transition-colors hover:text-leaf">
            {site.name}
          </Link>
          <p className="mt-2 max-w-[40ch] text-sm text-stone">{site.tagline}</p>
          <a
            href={site.phone.tel}
            className="mt-4 inline-block text-sm text-leaf transition-colors hover:text-paper"
          >
            Call <span className="tnum">{site.phone.display}</span>
          </a>
        </div>
        <nav aria-label="Service area" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {towns.map((t) => (
            <Link
              key={t.slug}
              href={`/service-area/${t.slug}`}
              className="text-stone transition-colors hover:text-leaf"
            >
              {t.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
