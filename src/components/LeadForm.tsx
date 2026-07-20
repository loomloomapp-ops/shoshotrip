"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import type { LeadSource } from "@/lib/leads";
import { track } from "@/lib/analytics";
import { Check } from "@/components/Icons";

interface LeadFormProps {
  locale: Locale;
  source: LeadSource;
  submitLabel?: string;
  /** Extra context auto-attached to the lead (tour booking / quiz). */
  context?: {
    tourName?: string;
    tourSlug?: string;
    tourDate?: string;
    quizAnswers?: string[];
  };
  onSuccess?: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

function collectAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v;
  });
  return {
    pageUrl: window.location.href,
    referrer: document.referrer || undefined,
    utm,
  };
}

export function LeadForm({
  locale,
  source,
  submitLabel,
  context,
  onSuccess,
}: LeadFormProps) {
  const dict = getDict(locale);
  const t = dict.form;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const telegram = String(data.get("telegram") || "").trim();
    const consent = data.get("consent") === "on";
    const company = String(data.get("company") || ""); // honeypot

    const localErrors: string[] = [];
    if (name.length < 2) localErrors.push("name");
    if (phone.replace(/\D/g, "").length < 9) localErrors.push("phone");
    if (!consent) localErrors.push("consent");
    setErrors(localErrors);
    if (localErrors.length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          telegram: telegram || undefined,
          consent,
          company,
          source,
          locale,
          ...context,
          ...collectAttribution(),
        }),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
      track("form_submit", { source, tour: context?.tourSlug });
      form.reset();
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-status form-status--success" role="status" aria-live="polite">
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.35rem", fontWeight: 600 }}>
          <Check width={18} height={18} /> {t.success.title}
        </div>
        <p style={{ margin: 0 }}>{t.success.text}</p>
      </div>
    );
  }

  const err = (key: string) => errors.includes(key);

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot (hidden from humans) */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={`company-${source}`}>Company</label>
        <input id={`company-${source}`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`field${err("name") ? " field--error" : ""}`}>
        <label htmlFor={`name-${source}`}>{t.name}</label>
        <input
          id={`name-${source}`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t.namePlaceholder}
          aria-invalid={err("name")}
          required
        />
        {err("name") && <span className="field__error">{t.errors.name}</span>}
      </div>

      <div className={`field${err("phone") ? " field--error" : ""}`}>
        <label htmlFor={`phone-${source}`}>{t.phone}</label>
        <input
          id={`phone-${source}`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+380 __ ___ __ __"
          aria-invalid={err("phone")}
          required
        />
        {err("phone") && <span className="field__error">{t.errors.phone}</span>}
      </div>

      <div className="field">
        <label htmlFor={`telegram-${source}`}>{t.telegram}</label>
        <input
          id={`telegram-${source}`}
          name="telegram"
          type="text"
          placeholder={t.telegramPlaceholder}
          autoComplete="off"
        />
      </div>

      <label className={`checkbox${err("consent") ? " field--error" : ""}`}>
        <input type="checkbox" name="consent" aria-invalid={err("consent")} />
        <span>{t.consent}</span>
      </label>
      {err("consent") && <span className="field__error">{t.errors.consent}</span>}

      {status === "error" && (
        <div className="form-status form-status--error" role="alert">
          {t.errors.generic}
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--full" disabled={status === "loading"}>
        {status === "loading" ? t.sending : submitLabel || dict.cta.pickTrip}
      </button>
    </form>
  );
}
