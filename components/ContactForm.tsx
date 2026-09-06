"use client";

import { useState } from "react";

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "address", label: "Property address", type: "text", autoComplete: "street-address" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
] as const;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Please call or text instead.");
      }
      form.reset();
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate={false} className="max-w-md">
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
          What do you need? <span className="text-stone/70">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full resize-y border border-stone/30 bg-surface px-4 py-3 text-paper focus:border-leaf focus:outline-none"
        />
      </p>

      <button
        type="submit"
        disabled={sending}
        className="min-h-12 w-full cursor-pointer bg-paper px-6 font-medium text-ink transition-colors hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {sending ? "Sending…" : "Send this to Westgate"}
      </button>

      <p aria-live="polite" className="mt-4 min-h-6 text-sm">
        {status.kind === "sent" && (
          <span className="text-leaf">
            Got it. We will call you back. If it is urgent, ring the number above.
          </span>
        )}
        {status.kind === "error" && <span className="text-paper">{status.message}</span>}
      </p>
    </form>
  );
}
