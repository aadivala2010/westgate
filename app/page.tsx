import Link from "next/link";
import Compare from "@/components/Compare";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import HeroSequence from "@/components/HeroSequence";
import StickyCallBar from "@/components/StickyCallBar";
import { services, site, steps, testimonials, towns } from "@/content/site";

const SECTION = "mx-auto max-w-6xl px-5 sm:px-10";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSequence />
        <div id="hero-end" aria-hidden="true" />
        <Services />
        <Work />
        <Process />
        <Area />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <StickyCallBar sentinelId="hero-end" />
    </>
  );
}

/* --- 2. What we do -------------------------------------------------------- */
function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <div className={SECTION}>
        <h2 className="display max-w-[16ch] text-4xl text-paper sm:text-5xl lg:text-6xl">
          What we do
        </h2>
        <p className="mt-6 max-w-[52ch] text-stone">
          Four things, done properly, on a schedule. If you need something that is not on this
          list, ask when you call.
        </p>

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
          Same property, same angle. Drag the handle across to see the difference a season on the
          schedule makes.
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
          Lancaster and the townships around it
        </h2>
        <p className="mt-6 max-w-[52ch] text-stone">
          We work a tight radius on purpose. A short drive between properties is what keeps the
          schedule honest.
        </p>

        <ul className="mt-12 sm:mt-16">
          {towns.map((t) => (
            <li key={t.slug} className="rule-t last:rule-b">
              <Link
                href={`/service-area/${t.slug}`}
                className="display flex min-h-16 items-center py-5 text-2xl text-paper transition-colors hover:text-leaf sm:text-3xl"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-stone">
          Just outside the list? Call and ask — we will tell you straight either way.
        </p>
      </div>
    </section>
  );
}

/* --- 6. Testimonials ------------------------------------------------------ */
function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className={SECTION}>
        <ul className="grid gap-12 sm:grid-cols-3 sm:gap-10">
          {testimonials.map((t) => (
            <li key={t.quote}>
              <figure>
                <blockquote className="display max-w-[34ch] text-2xl text-paper">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 text-sm text-stone">
                  {t.name}, {t.town}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --- 7. Contact ----------------------------------------------------------- */
function Contact() {
  return (
    <section id="contact" className="rule-t py-24 sm:py-32">
      <div className={SECTION}>
        <h2 className="display max-w-[14ch] text-4xl text-paper sm:text-5xl lg:text-6xl">
          Pricing happens on the phone
        </h2>
        <p className="mt-6 max-w-[52ch] text-stone">
          Every property is different, so we quote after we have seen it. Call or text and we will
          set up a walk-through.
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
            <h3 className="display text-2xl text-paper sm:text-3xl">Or leave your details</h3>
            <p className="mt-4 mb-10 max-w-[46ch] text-stone">
              Slower than calling, but it works. We read these in the evening.
            </p>
            <ContactForm />
          </div>

          <dl className="self-start text-sm">
            {[
              ["Phone", site.phone.display],
              ["Email", site.email],
              ["Address", `${site.address.street}, ${site.address.locality}, PA ${site.address.postalCode}`],
              ["Hours", site.hours],
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

/* --- Footer --------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="rule-t bg-surface py-14 pb-28 md:pb-14">
      <div className={`${SECTION} flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between`}>
        <div>
          <p className="display text-2xl text-paper">{site.name}</p>
          <p className="mt-2 max-w-[40ch] text-sm text-stone">{site.tagline}</p>
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
