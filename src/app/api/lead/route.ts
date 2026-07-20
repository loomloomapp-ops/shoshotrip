import { NextResponse } from "next/server";
import { deliverLead, validateLead, type LeadPayload } from "@/lib/leads";

export const runtime = "nodejs";

interface LeadRequest extends LeadPayload {
  consent?: boolean;
  // Honeypot field — must stay empty for a real human.
  company?: string;
}

export async function POST(request: Request) {
  let body: LeadRequest;
  try {
    body = (await request.json()) as LeadRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot: silently accept but drop bot submissions.
  if (body.company && body.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateLead(body);
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const { consent, company, ...lead } = body;
  void consent;
  void company;

  try {
    const { delivered } = await deliverLead(lead);
    if (!delivered) {
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
