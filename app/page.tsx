import Link from "next/link";
import Compare from "@/components/Compare";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StickyCallBar from "@/components/StickyCallBar";
import { services, site, steps, towns } from "@/content/site";

const SECTION = "mx-auto max-w-6xl px-5 sm:px-10";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <div id="hero-end" aria-hidden="true" />
        <Services />
        <Work />
        <Process />
        <Area />
        <Contact />
      </main>
      <Footer />
      <StickyCallBar sentinelId="hero-end" />
    </>
  );
}

/* --- 2. What I do -------------------------------------------------------- */
function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <div className={SECTION}>
        <h2 className="display max-w-[16ch] text-4xl text-paper sm:text-5xl lg:text-6xl">
          What I do
        </h2>
        <ul className="mt-14 sm:mt-20">
          {services.map((s) => (
            <li
              key={s.title}
              className="rule-t grid gap-3 py-8 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-10 sm:py-12 last:rule-b"
            >
              <h3 className="display text-2xl text-paper sm:text-3xl">{s.title}</h3>
              <p className="max-w-[62ch] text-stone">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --- 3. The work ---------------------------------------------------------- */
function Work() {
  return (
    <section id="work" className="bg-surface py-24 sm:py-32">
      <div className={SECTION}>
        <h2 className="display max-w-[16ch] text-4xl text-paper sm:text-5xl lg:text-6xl">
          The work
        </h2>
        <p className="mt-6 mb-12 max-w-[52ch] text-stone">
          Same corner, same angle, before and after. Drag the handle across to see it.
        </p>
        <Compare />
      </div>
    </section>
  );
}

/* --- 4. How it works ------------------------------------------------------ */
function Process() {
  return (
    <section id="process" className="py-24 sm:py-32">
      <div className={SECTION}>
        <h2 className="display max-w-[16ch] text-4xl text-paper sm:text-5xl lg:text-6xl">
          How it works
        </h2>

        <ol className="mt-14 grid gap-12 sm:mt-20 sm:grid-cols-3 sm:gap-10">
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

        <a
          href={site.phone.tel}
          className="mt-14 inline-block border-b border-leaf pb-1 text-lg text-leaf transition-colors hover:text-paper sm:mt-20"
        >
          Call <span className="tnum">{site.phone.display}</span>
        </a>
      </div>
    </section>
  );
}

/* --- 5. Service area ------------------------------------------------------ */
function Area() {
  return (
    <section id="area" className="bg-surface py-24 sm:py-32">
      <div className={SECTION}>
        <h2 className="display max-w-[18ch] text-4xl text-paper sm:text-5xl lg:text-6xl">
          Areas I service
        </h2>
        <p className="mt-6 max-w-[52ch] text-stone">
          I work a tight radius on purpose. Short drives between properties are what keep the day
          honest.
        </p>

        <div className="mt-12 grid gap-12 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16">
          {/* Two columns of names rather than one row each: the list is long
              enough that full-width rows would run past the map. */}
          <ul className="rule-b grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {towns.map((t) => (
              <li key={t.slug} className="rule-t">
                {t.blurb ? (
                  <Link
                    href={`/service-area/${t.slug}`}
                    className="display flex min-h-14 items-center py-3 text-xl text-paper transition-colors hover:text-leaf sm:text-2xl"
                  >
                    {t.name}
                  </Link>
                ) : (
                  <span className="display flex min-h-14 items-center py-3 text-xl text-paper sm:text-2xl">
                    {t.name}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <figure className="lg:sticky lg:top-28 lg:self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/areas.webp"
              alt="Satellite map of northern Lancaster County with a circle drawn around Brownstown, reaching Lititz and East Petersburg to the north west, New Holland and Blue Ball to the east, and Lancaster city and Leola to the south."
              width={900}
              height={900}
              loading="lazy"
              decoding="async"
              className="w-full"
            />
            <figcaption className="mt-4 text-sm text-stone">
              Centred on Brownstown, out to Lancaster city one way and New Holland the other.
            </figcaption>
          </figure>
        </div>

        <p className="mt-10 text-sm text-stone">
          Just outside the circle? Call and ask — I will tell you straight either way.
        </p>
      </div>
    </section>
  );
}

/* --- 6. Contact ----------------------------------------------------------- */
function Contact() {
  return (
    <section id="contact" className="rule-t py-24 sm:py-32">
      <div className={SECTION}>
        <h2 className="display max-w-[14ch] text-4xl text-paper sm:text-5xl lg:text-6xl">
          Pricing happens on the phone
        </h2>
        <p className="mt-6 max-w-[52ch] text-stone">
          Every property is different, so I price it once I have seen it — usually from the photos
          you send. The quote is free either way. Call or text and I will get you one.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href={site.phone.tel}
            className="flex min-h-16 flex-1 items-center justify-center bg-leaf px-8 text-lg font-medium text-ink transition-colors hover:bg-paper sm:flex-none sm:justify-start"
          >
            Call <span className="tnum ml-2">{site.phone.display}</span>
          </a>
          <a
            href={site.phone.sms}
            className="flex min-h-16 flex-1 items-center justify-center border border-stone/40 px-8 text-lg font-medium text-paper transition-colors hover:border-leaf hover:text-leaf sm:flex-none sm:justify-start"
          >
            Text <span className="tnum ml-2">{site.phone.display}</span>
          </a>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h3 className="display text-2xl text-paper sm:text-3xl">Or send me the details</h3>
            <p className="mt-4 mb-10 max-w-[46ch] text-stone">
              Fill this in and it opens your own email or messages app with everything written
              out, ready for you to send.
            </p>
            <ContactForm />
          </div>

          <dl className="self-start text-sm">
            {[
              ["Phone", site.phone.display],
              ["Email", site.email],
            ].map(([label, value]) => (
              <div key={label} className="rule-t flex flex-wrap gap-x-6 gap-y-1 py-4 last:rule-b">
                <dt className="w-24 shrink-0 text-stone">{label}</dt>
                <dd className="text-paper">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
