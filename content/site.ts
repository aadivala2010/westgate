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
  hours: "Mon–Sat, 7am–6pm",
  openingHoursSpec: "Mo-Sa 07:00-18:00", // schema.org openingHours format
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
  hours: PLACEHOLDERS.hours,
  openingHours: PLACEHOLDERS.openingHoursSpec,
} as const;

// --- Hero -------------------------------------------------------------------
// `at` is scroll progress through the hero container, 0–1. Lines cross-fade in
// and out around these points.
export const heroLines = [
  { at: 0.06, text: "A lawn people notice." },
  { at: 0.42, text: "Cut on a schedule, edged by hand, cleaned up before we leave." },
  { at: 0.78, text: "Lancaster County, every week of the season." },
] as const;

// --- Services ---------------------------------------------------------------
export const services = [
  {
    title: "Weekly mowing",
    body: "The same crew, the same day each week, at a height that suits the grass and the season. Stripes run a different direction each visit so the turf does not lean.",
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
    body: "Shaped to the plant rather than sheared flat, on a schedule that keeps foundation plantings off the windows and the walk.",
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
    body: "Tell us the address and roughly what you are after. A text with a photo is plenty to start.",
  },
  {
    title: "We walk the property",
    body: "We come out, look at the grade, the beds, the gates and the trees, and quote a price for the season. No charge for the visit.",
  },
  {
    title: "You are on the schedule",
    body: "A fixed day each week. You will know when we are coming, and you will know when we have been.",
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
  { href: "/#services", label: "What we do" },
  { href: "/#work", label: "The work" },
  { href: "/#process", label: "How it works" },
  { href: "/#area", label: "Service area" },
  { href: "/#contact", label: "Contact" },
] as const;
