import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/content/site";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-5 pt-36 pb-24 sm:px-10 sm:pt-44 sm:pb-32">
        <p className="text-sm tracking-[0.18em] text-stone uppercase">404</p>
        <h1 className="display mt-6 max-w-[16ch] text-4xl text-paper sm:text-6xl">
          That page is not here
        </h1>
        <p className="mt-8 max-w-[52ch] text-lg text-stone">
          The link may be old, or the town may not be one I cover. Either way, call and ask — I
          will tell you straight.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href={site.phone.tel}
            className="flex min-h-16 items-center justify-center bg-leaf px-8 text-lg font-medium text-ink transition-colors hover:bg-paper sm:justify-start"
          >
            Call <span className="tnum ml-2">{site.phone.display}</span>
          </a>
          <Link
            href="/"
            className="flex min-h-16 items-center justify-center border border-stone/40 px-8 text-lg font-medium text-paper transition-colors hover:border-leaf hover:text-leaf sm:justify-start"
          >
            Back to the home page
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
