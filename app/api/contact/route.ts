import { NextResponse } from "next/server";

// Trust boundary: everything below is attacker-controlled. Validate before use.
const LIMITS = { name: 120, address: 240, phone: 40, message: 2000 } as const;

type Lead = { name: string; address: string; phone: string; message: string };

function validate(body: unknown): { ok: true; lead: Lead } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid request." };
  const raw = body as Record<string, unknown>;

  const read = (key: keyof typeof LIMITS) => (typeof raw[key] === "string" ? raw[key].trim() : "");

  const lead: Lead = {
    name: read("name"),
    address: read("address"),
    phone: read("phone"),
    message: read("message"),
  };

  for (const [key, max] of Object.entries(LIMITS)) {
    if (lead[key as keyof Lead].length > max) {
      return { ok: false, error: `That ${key} is too long.` };
    }
  }
  if (!lead.name) return { ok: false, error: "Please include a name." };
  if (!lead.address) return { ok: false, error: "Please include the property address." };
  // Deliberately loose: people write numbers a dozen ways and a rejected lead
  // is worse than a malformed one we can still call back.
  if ((lead.phone.match(/\d/g) ?? []).length < 10) {
    return { ok: false, error: "Please include a phone number we can reach you on." };
  }

  return { ok: true, lead };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validate(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // TODO(wiring): this is where the lead actually goes somewhere.
  //   1. Resend — email the lead to site.email.
  //      await resend.emails.send({ from, to, subject, text })
  //   2. Twilio — SMS the crew at site.phone.e164 so it lands on the phone
  //      they already carry.
  //      await twilio.messages.create({ to, from, body })
  // Both need env vars (RESEND_API_KEY, TWILIO_*) set in Vercel. Until then the
  // lead is logged only, which means it survives exactly as long as the
  // function log does — do not launch on this.
  console.log("[contact] lead", result.lead);

  return NextResponse.json({ ok: true });
}
