import { NextResponse } from "next/server";
import { site } from "@/content/site";

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

/**
 * Emails the lead through Resend's HTTP API. Called directly with fetch rather
 * than through the SDK — it is one POST, and a dependency for that is not worth
 * carrying.
 *
 * Returns false if it did not send, so the caller can decide what to tell the
 * visitor. With no RESEND_API_KEY set this is a no-op and the lead is only
 * logged, which is the state the site ships in.
 */
async function sendLeadEmail(lead: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  // Resend will only send from a domain verified on the account. Until
  // westgatemowing.com is verified, onboarding@resend.dev works for testing.
  const from = process.env.CONTACT_FROM ?? "Westgate Mowing <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO ?? site.email;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      // So hitting reply in the inbox goes to the customer, not to Resend.
      reply_to: lead.phone,
      subject: `Lawn enquiry — ${lead.name}, ${lead.address}`,
      text: [
        `Name:     ${lead.name}`,
        `Phone:    ${lead.phone}`,
        `Address:  ${lead.address}`,
        "",
        lead.message || "(no message)",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("[contact] resend failed", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validate(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Always log. If the send fails, the lead is at least recoverable from the
  // function log rather than lost outright.
  console.log("[contact] lead", result.lead);

  const sent = await sendLeadEmail(result.lead).catch((err) => {
    console.error("[contact] send threw", err);
    return false;
  });

  // TODO(optional): also SMS the crew via Twilio, so a lead lands on the phone
  // they already carry rather than in an inbox. Same shape as the fetch above:
  // POST to https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json with
  // basic auth, needing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM.

  if (!sent) {
    // Do not claim it went through when it did not. The call and text links are
    // the reliable path and the form already points at them.
    return NextResponse.json(
      { error: "We could not send that. Please call or text instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
