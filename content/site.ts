// Single source of truth for every piece of copy and config on the site.
// There is no CMS. Edit this file, redeploy.

// ---------------------------------------------------------------------------
// PLACEHOLDERS — everything the client still needs to confirm lives here.
// Search the repo for `{{` to find any that leaked elsewhere.
// ---------------------------------------------------------------------------
export const PLACEHOLDERS = {
  addressLocality: "{{Lancaster}}",
  postalCode: "{{17601}}",
  hours: "{{Mon–Sat, 7am–6pm}}",
  openingHoursSpec: "{{Mo-Sa 07:00-18:00}}", // schema.org openingHours format
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
export const hero = {
  headline: "A lawn people notice.",
  lede:
    "Cut on a schedule, edged by hand, cleaned up before we leave. Lancaster County, every week of the season.",
} as const;

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
    width: 476,
    height: 280,
    label: "Front lawn on a columned property",
    beforeAlt:
      "Front lawn overgrown with clover and broadleaf weeds, uneven in height, in front of a white columned porch.",
    afterAlt:
      "The same front lawn cut short and evenly, with clean mowing stripes running toward the tree line.",
  },
  {
    id: "ba2",
    before: "/work/ba2-before.webp",
    after: "/work/ba2-after.webp",
    width: 476,
    height: 280,
    label: "Fenced back yard",
    beforeAlt:
      "Patchy back yard along a wooden privacy fence, with bare soil, weeds and an unkempt bed line.",
    afterAlt:
      "The same back yard mowed to an even green with a defined bed edge along the fence.",
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
// TODO(client): confirm the full service radius. These four are the starting
// set; adding a town here generates its page, sitemap entry and JSON-LD entry.
export const towns = [
  {
    slug: "lancaster",
    name: "Lancaster",
    blurb:
      "Most city work is a matter of access. Row-home strips off Chestnut and Prince run narrow and are shaded hard by mature street trees, so the grass is thin and wants a higher cut than a suburban lawn. The larger lots out toward School Lane Hills and Chestnut Hill are the opposite problem: open, fast-growing, and obvious to the whole street when they get away from you.",
  },
  {
    slug: "millersville",
    name: "Millersville",
    blurb:
      "A lot of Millersville is rental property within walking distance of the university, and those lawns tend to be judged by the landlord and the borough rather than by the tenant. We keep them cut on a fixed weekly day through the season so nobody has to think about it. Borough lots are compact, and the trimming around walks and porch steps is most of the work.",
  },
  {
    slug: "manor-township",
    name: "Manor Township",
    blurb:
      "West of the city the parcels open up: half an acre and well past it, often with a long road frontage and a septic field to mow around. That is a different job from a city lot. More open sun, faster growth through May and June, and enough ground that skipping a week shows. We size the crew and the deck to the property rather than the other way around.",
  },
  {
    slug: "lampeter",
    name: "Lampeter",
    blurb:
      "Lampeter properties tend to sit against working farmland, which means wind, full exposure, and seed blowing in from the field next door. Weed pressure along the back edge is the thing to stay ahead of here. Long road frontages also mean the strip along the shoulder is the part everyone actually sees.",
  },
] as const;

export type Town = (typeof towns)[number];

// --- Top banner -------------------------------------------------------------
// Static bar above the header. Rendered uppercase, so write it in sentence case.
export const bannerText = "Free quotes";

// --- Nav --------------------------------------------------------------------
export const navLinks = [
  { href: "#services", label: "What we do" },
  { href: "#work", label: "The work" },
  { href: "#process", label: "How it works" },
  { href: "#area", label: "Service area" },
  { href: "#contact", label: "Contact" },
] as const;
