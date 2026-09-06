"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "address", label: "Property address", type: "text", autoComplete: "street-address" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
] as const;

/**
 * No server, no API key, no third party. The two buttons build a message from
 * the fields and hand it to the visitor's own mail or messages app through a
 * mailto:/sms: link — they press send there, so the message goes out from their
 * address and lands in their sent folder.
 *
 * The trade-off worth knowing: a machine with no mail client configured will do
 * nothing at all when the link fires, silently. Hence the note after the
 * buttons pointing back at the phone number, which always works.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [opened, setOpened] = useState<"email" | "text" | null>(null);

  function compose(kind: "email" | "text") {
    const form = formRef.current;
    // Native constraint validation: the browser shows its own messages and
    // focuses the first bad field, so there is nothing to hand-roll.
    if (!form || !form.reportValidity()) return;

    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const work = get("message") || "Not specified";

    if (kind === "email") {
      const subject = `Quote request — ${get("address")}`;
      const body = [
        "I would like a quote for my property.",
        "",
        `Name: ${get("name")}`,
        `Address: ${get("address")}`,
        `Phone: ${get("phone")}`,
        "",
        `Work needed: ${work}`,
      ].join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
    } else {
      const body = [
        "Quote request.",
        `${get("name")}, ${get("address")}, ${get("phone")}.`,
        `Work needed: ${work}`,
      ].join("\n");
      // `?&body=` rather than `?body=` or `&body=`: iOS and Android disagree on
      // the separator, and this form is the one both accept.
      window.location.href = `${site.phone.sms}?&body=${encodeURIComponent(body)}`;
    }

    setOpened(kind);
  }

  return (
    <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="max-w-md">
      {FIELDS.map((f) => (
        <p key={f.name} className="mb-5">
          <label htmlFor={f.name} className="mb-2 block text-sm text-stone">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            required
            autoComplete={f.autoComplete}
            className="min-h-12 w-full border border-stone/30 bg-surface px-4 py-3 text-paper placeholder:text-stone/60 focus:border-leaf focus:outline-none"
          />
        </p>
      ))}

      <p className="mb-6">
        <label htmlFor="message" className="mb-2 block text-sm text-stone">
          Work to be done
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full resize-y border border-stone/30 bg-surface px-4 py-3 text-paper focus:border-leaf focus:outline-none"
        />
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => compose("email")}
          className="min-h-12 cursor-pointer bg-paper px-6 font-medium text-ink transition-colors hover:bg-leaf"
        >
          Send as email
        </button>
        <button
          type="button"
          onClick={() => compose("text")}
          className="min-h-12 cursor-pointer border border-stone/40 px-6 font-medium text-paper transition-colors hover:border-leaf hover:text-leaf"
        >
          Send as text
        </button>
      </div>

      <p aria-live="polite" className="mt-4 min-h-6 text-sm text-stone">
        {opened
          ? `Your ${opened === "email" ? "email" : "messages"} app should have opened with the details filled in — press send there. If nothing happened, call or text ${site.phone.display} instead.`
          : "Either button fills in a message and opens your own email or messages app. Nothing is sent until you press send there."}
      </p>
    </form>
  );
}
