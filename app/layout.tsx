import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { site, towns } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — lawn care in Lancaster, PA`,
    template: `%s — ${site.name}`,
  },
  description:
    "Mowing, hand edging, hedge trimming and seasonal cleanup for properties in Lancaster, Pennsylvania and the towns around it. One man, call or text for a quote.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    url: site.url,
  },
};

export const viewport: Viewport = {
  themeColor: "#0C110D",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}#business`,
  name: site.name,
  url: site.url,
  telephone: site.phone.e164,
  email: site.email,
  image: `${site.url}/opengraph-image`,
  priceRange: "$$",
  // No streetAddress: the site does not publish one. Locality and region are
  // what carry the local signal for a service-area business.
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: towns.map((t) => ({
    "@type": "City",
    name: `${t.name}, PA`,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrumentSerif.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-leaf focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
