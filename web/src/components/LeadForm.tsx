"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = {
  t: Dictionary["contact"]["form"];
  whatsapp: string;
  /** The admin's address, passed from the server so it isn't baked in at build time */
  apiUrl: string;
};

// Opens WhatsApp with a pre-filled message and saves the lead in the admin panel.
export function LeadForm({ t, whatsapp, apiUrl }: Props) {
  const [invalid, setInvalid] = useState<{ name?: boolean; phone?: boolean }>({});
  const [status, setStatus] = useState<"idle" | "error" | "opening">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const errors = { name: get("name").length < 2, phone: get("phone").length < 7 };
    setInvalid(errors);
    if (errors.name || errors.phone) {
      setStatus("error");
      return;
    }
    setStatus("opening");

    const m = t.message;
    const lines = [m.intro, "", `${m.name}: ${get("name")}`, `${m.phone}: ${get("phone")}`];
    if (get("practice")) lines.push(`${m.practice}: ${get("practice")}`);
    if (get("specialty")) lines.push(`${m.specialty}: ${get("specialty")}`);

    // Open WhatsApp first, synchronously in the click, so popup blockers allow it
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");

    if (apiUrl) {
      fetch(`${apiUrl}/api/v1/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: get("name"),
          phone: get("phone"),
          practice: get("practice"),
          specialty: get("specialty"),
          website: get("website"), // honeypot — real visitors leave it empty
          locale: document.documentElement.lang,
        }),
        keepalive: true,
      }).catch(() => {
        // WhatsApp already has the details; a failed save must not bother the visitor
      });
    }
  };

  const clear = (field: "name" | "phone") => () => invalid[field] && setInvalid((v) => ({ ...v, [field]: false }));

  return (
    <form className="form" noValidate onSubmit={onSubmit} data-reveal>
      <div className="form__row">
        <input type="text" name="name" required autoComplete="name" placeholder={t.name} aria-label={t.name}
          className={invalid.name ? "is-invalid" : undefined} onInput={clear("name")} />
        <input type="tel" name="phone" required autoComplete="tel" placeholder={t.phone} aria-label={t.phone} dir="auto"
          className={invalid.phone ? "is-invalid" : undefined} onInput={clear("phone")} />
      </div>
      <div className="form__row">
        <input type="text" name="practice" placeholder={t.practice} aria-label={t.practice} />
        <select name="specialty" aria-label={t.specialty} defaultValue="" required>
          <option value="" disabled>{t.specialty}</option>
          {t.specialties.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {/* Honeypot: hidden from people, filled in by spam bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form__hp" />
      <button type="submit" className="btn btn--primary btn--lg btn--block">{t.submit}</button>
      <p className={`form__note${status === "error" ? " is-error" : ""}`} aria-live="polite">
        {status === "error" ? t.error : status === "opening" ? t.opening : t.note}
      </p>
    </form>
  );
}
