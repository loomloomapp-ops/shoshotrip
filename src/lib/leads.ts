/**
 * Lead service layer (server-side only).
 * Delivers a submitted lead to whichever channels are configured via env.
 * Never import this from client components. Secrets stay in the server env.
 */

export type LeadSource = "quiz" | "tour" | "modal" | "widget" | "sticky";

export interface LeadPayload {
  name: string;
  phone: string;
  telegram?: string;
  source: LeadSource;
  locale: string;
  // Auto-attached context (tour booking / attribution)
  tourName?: string;
  tourSlug?: string;
  tourDate?: string;
  quizAnswers?: string[];
  pageUrl?: string;
  referrer?: string;
  utm?: Record<string, string>;
  submittedAt?: string;
}

function formatMessage(lead: LeadPayload): string {
  const lines = [
    `🧭 ShoSho Trip — нова заявка (${lead.source})`,
    `Імʼя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.telegram ? `Telegram: ${lead.telegram}` : null,
    lead.tourName ? `Тур: ${lead.tourName}` : null,
    lead.tourDate ? `Дата: ${lead.tourDate}` : null,
    lead.quizAnswers?.length
      ? `Відповіді тесту:\n${lead.quizAnswers.map((a, i) => `  ${i + 1}. ${a}`).join("\n")}`
      : null,
    `Мова: ${lead.locale}`,
    lead.pageUrl ? `Сторінка: ${lead.pageUrl}` : null,
    lead.referrer ? `Referrer: ${lead.referrer}` : null,
    lead.utm && Object.keys(lead.utm).length
      ? `UTM: ${Object.entries(lead.utm)
          .map(([k, v]) => `${k}=${v}`)
          .join(", ")}`
      : null,
    `Час: ${lead.submittedAt ?? new Date().toISOString()}`,
  ].filter(Boolean);
  return lines.join("\n");
}

async function sendTelegram(lead: LeadPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatMessage(lead),
      disable_web_page_preview: true,
    }),
  });
}

async function sendWebhook(url: string | undefined, lead: LeadPayload): Promise<void> {
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
}

/**
 * Fan out to every configured channel. Failures on one channel don't block
 * the others; the route decides how to report overall success.
 */
export async function deliverLead(lead: LeadPayload): Promise<{ delivered: boolean }> {
  const withTime: LeadPayload = {
    ...lead,
    submittedAt: lead.submittedAt ?? new Date().toISOString(),
  };

  const tasks: Promise<unknown>[] = [
    sendTelegram(withTime),
    sendWebhook(process.env.LEAD_WEBHOOK_URL, withTime),
    sendWebhook(process.env.GOOGLE_SHEETS_WEBHOOK_URL, withTime),
  ];

  const results = await Promise.allSettled(tasks);
  const anyConfigured =
    Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) ||
    Boolean(process.env.LEAD_WEBHOOK_URL) ||
    Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL);

  // If nothing is configured yet (local/dev), log so the lead is never lost.
  if (!anyConfigured) {
    console.info("[lead] No delivery channel configured. Lead payload:", withTime);
    return { delivered: true };
  }

  const delivered = results.some((r) => r.status === "fulfilled");
  return { delivered };
}

/** Server-side validation shared with the client rules. */
export function validateLead(input: Partial<LeadPayload> & { consent?: boolean }): string[] {
  const errors: string[] = [];
  if (!input.name || input.name.trim().length < 2) errors.push("name");
  const digits = (input.phone || "").replace(/\D/g, "");
  if (digits.length < 9) errors.push("phone");
  if (!input.consent) errors.push("consent");
  return errors;
}
