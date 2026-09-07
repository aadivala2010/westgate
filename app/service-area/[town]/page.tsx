import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { services, site, steps, towns } from "@/content/site";

type Props = { params: Promise<{ town: string }> };

export function generateStaticParams() {
  return towns.map((t) => ({ town: t.slug }));
}

// Nothing is dynamic here, so anything off the town list is a 404 rather than
// a rendered page for a place we do not serve.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { town: slug } = await params;
  const town = towns.find((t) => t.slug === slug);
  if (!town) return {};
  return {
    title: `Lawn Mowing in ${town.name}, PA`,
    description: `Weekly mowing, hand edging and seasonal cleanup in ${town.name}, Pennsylvania. Call or text ${site.phone.display} for a quote.`,
    alternates: { canonical: `/service-area/${town.slug}` },
    openGraph: {
      title: `Lawn Mowing in ${town.name}, PA — ${site.name}`,
      url: `/service-area/${town.slug}`,
    },
  };
}

export default async function TownPage({ params }: Props) {
  const { town: slug } = await params;
  const town = towns.find((t) => t.slug === slug);
  if (!town) notFound();

  const others = towns.filter((t) => t.slug !== town.slug);

  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-5 pt-36 pb-24 sm:px-10 sm:pt-44 sm:pb-32">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-stone">
          <Link href="/" className="transition-colors hover:text-leaf">
            {site.name}
          </Link>
          <span className="px-2" aria-hidden="true">
            /
          </span>
          <span className="text-paper">{town.name}</span>
        </nav>

        <h1 className="display max-w-[16ch] text-4xl text-paper sm:text-6xl lg:text-7xl">
          Lawn mowing in {town.name}, PA
        </h1>

        <p className="mt-10 max-w-[62ch] text-lg text-stone">{town.blurb}</p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href={site.phone.tel}
            className="flex min-h-16 items-center justify-center bg-leaf px-8 text-lg font-medium text-ink transition-colors hover:bg-paper sm:justify-start"
          >
            Call <span className="tnum ml-2">{site.phone.display}</span>
          </a>
          <a
            href={site.phone.sms}
            className="flex min-h-16 items-center justify-center border border-stone/40 px-8 text-lg font-medium text-paper transition-colors hover:border-leaf hover:text-leaf sm:justify-start"
          >
            Text <span className="tnum ml-2">{site.phone.display}</span>
          </a>
        </div>

        <h2 className="display mt-24 text-3xl text-paper sm:mt-32 sm:text-4xl">
          What we do in {town.name}
        </h2>
        <ul className="mt-10">
          {services.map((s) => (
            <li
              key={s.title}
              className="rule-t grid gap-3 py-7 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-10 last:rule-b"
            >
              <h3 className="display text-2xl text-paper">{s.title}</h3>
              <p className="max-w-[62ch] text-stone">{s.body}</p>
            </li>
          ))}
        </ul>

        <h2 className="display mt-24 text-3xl text-paper sm:mt-32 sm:text-4xl">Getting started</h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-moss pt-6">
              <span className="display block text-3xl text-moss tnum" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-medium text-paper">{s.title}</h3>
              <p className="mt-3 max-w-[42ch] text-stone">{s.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="display mt-24 text-3xl text-paper sm:mt-32 sm:text-4xl">
          We also work in
        </h2>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {others.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/service-area/${t.slug}`}
                className="border-b border-transparent pb-1 text-lg text-stone transition-colors hover:border-leaf hover:text-paper"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
