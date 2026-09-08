// Single source of truth for every piece of copy and config on the site.
// There is no CMS. Edit this file, redeploy.

// ---------------------------------------------------------------------------
// PLACEHOLDERS — everything the client still needs to confirm lives here.
// Every value here reaches the page as-is, so keep them presentable.
// ---------------------------------------------------------------------------
// These render verbatim — in the contact block and in the LocalBusiness JSON-LD
// Google reads — so they hold plausible values rather than `{{braces}}`. Confirm
// each with the client and edit in place.
export const PLACEHOLDERS = {
  addressLocality: "Lancaster",
  postalCode: "17601",
} as const;

// TODO(client): replace public/logo-mark.png with a transparent PNG or SVG.
// The supplied logo.jpeg has a baked white background, so the header places the
// mark inside a white chip rather than sitting it directly on the dark surface.

const PHONE_E164 = "+17175387526";

export const site = {
  name: "Westgate Mowing",
  tagline: "Lawn care in Lancaster, Pennsylvania",
  url: "https://westgatemowing.com", // TODO(client): confirm production domain
  phone: {
    e164: PHONE_E164,
    display: "(717) 538-7526",
    tel: `tel:${PHONE_E164}`,
    sms: `sms:${PHONE_E164}`,
  },
  email: "areed.quinn@gmail.com",
  address: {
    locality: PLACEHOLDERS.addressLocality,
    region: "PA",
    postalCode: PLACEHOLDERS.postalCode,
    country: "US",
  },
} as const;

// --- Hero -------------------------------------------------------------------
// `at` is scroll progress through the hero container, 0–1. Lines cross-fade in
// and out around these points.
export const heroLines = [
  { at: 0.06, text: "A lawn people notice." },
  { at: 0.42, text: "Cut clean, edged by hand, tidied up before I leave." },
  { at: 0.78, text: "One man, Lancaster County, work you can point at." },
] as const;

// --- Services ---------------------------------------------------------------
export const services = [
  {
    title: "Mowing",
    body: "Cut at a height that suits the grass and the time of year. Stripes run a different direction each visit so the turf does not lean.",
  },
  {
    title: "Edging and trimming",
    body: "Beds, walks, drives and fence lines cut by hand. This is the difference between a lawn that has been mowed and a lawn that has been finished.",
  },
  {
    title: "Spring and fall cleanup",
    body: "Leaves, winter debris and bed edges at the two points in the year when a property either gets ahead or falls behind.",
  },
  {
    title: "Hedge and shrub trimming",
    body: "Shaped to the plant rather than sheared flat, cut back far enough to keep foundation plantings off the windows and the walk.",
  },
] as const;

// --- The work ---------------------------------------------------------------
// Add a pair by dropping two WebPs in public/work/ and appending an entry.
// Both images in a pair must share the same aspect ratio.
export const workPairs = [
  {
    id: "ba1",
    before: "/work/ba1-before.webp",
    after: "/work/ba1-after.webp",
    width: 760,
    height: 1336,
    label: "Overgrown shrub along a back fence",
    beforeAlt:
      "A shrub grown out over the lawn and into a fence line, its branches hanging low over a tarp laid on the grass.",
    afterAlt:
      "The same shrub cut back to its shape, the fence and the bed behind it clear again, with the clippings piled on the tarp.",
  },
] as const;

// --- How it works -----------------------------------------------------------
export const steps = [
  {
    title: "Call or text",
    body: "Tell me the address and roughly what you are after. A text with a couple of photos is plenty to start.",
  },
  {
    title: "I price it",
    body: "Most of the time your photos are enough for me to give you a price. If the property is large or awkward, or I cannot see enough from the pictures, I drive out and walk it. Either way there is no charge for the quote.",
  },
  {
    title: "I show up and do it",
    body: "You will know the day I am coming, and you will know when I have been. Same again whenever you want it done.",
  },
] as const;

// --- Service area -----------------------------------------------------------
// The radius on the map in public/areas.webp, centred on Brownstown. A town
// only gets its own page, sitemap entry and internal links once it has a
// blurb; the rest are listed on the home page and in the JSON-LD areaServed.
export type Town = { slug: string; name: string; blurb?: string };

export const towns: readonly Town[] = [
  { slug: "brownstown", name: "Brownstown" },
  { slug: "akron", name: "Akron" },
  { slug: "leola", name: "Leola" },
  { slug: "ephrata", name: "Ephrata" },
  { slug: "rothsville", name: "Rothsville" },
  { slug: "lititz", name: "Lititz" },
  { slug: "bird-in-hand", name: "Bird-in-Hand" },
  { slug: "smoketown", name: "Smoketown" },
  { slug: "witmer", name: "Witmer" },
  { slug: "stevens", name: "Stevens" },
  { slug: "east-petersburg", name: "East Petersburg" },
  {
    slug: "lancaster",
    name: "Lancaster",
    blurb:
      "Most city work is a matter of access. Row-home strips off Chestnut and Prince run narrow and are shaded hard by mature street trees, so the grass is thin and wants a higher cut than a suburban lawn. The larger lots out toward School Lane Hills and Chestnut Hill are the opposite problem: open, fast-growing, and obvious to the whole street when they get away from you.",
  },
  { slug: "new-holland", name: "New Holland" },
  { slug: "blue-ball", name: "Blue Ball" },
  { slug: "reamstown", name: "Reamstown" },
  { slug: "hopeland", name: "Hopeland" },
  { slug: "farmersville", name: "Farmersville" },
  { slug: "talmage", name: "Talmage" },
  { slug: "intercourse", name: "Intercourse" },
  { slug: "paradise", name: "Paradise" },
];

export const townPages = towns.filter((t) => t.blurb);

// --- Top banner -------------------------------------------------------------
// Static bar above the header. Rendered uppercase, so write it in sentence case.
export const bannerText = "Free quotes";

// --- Nav --------------------------------------------------------------------
// Root-relative, not bare fragments: the header also renders on the town pages,
// where these sections do not exist. From "/" the browser treats "/#services" as
// a same-document jump (smooth scroll, no reload); from a town page it goes home
// and lands on the section.
export const navLinks = [
  { href: "/#services", label: "What I do" },
  { href: "/#work", label: "The work" },
  { href: "/#process", label: "How it works" },
  { href: "/#area", label: "Service area" },
  { href: "/#contact", label: "Contact" },
] as const;
