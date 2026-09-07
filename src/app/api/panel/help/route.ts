import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isPanelAuthenticated, isPanelConfigured } from "@/lib/panel/auth";
import {
  assertJsonContentType,
  assertSameOrigin,
  readJsonLimited,
} from "@/lib/panel/requestGuard";
import { sanitizeEmailHeader } from "@/lib/security/validateContact";

export const runtime = "nodejs";

const SUPPORT_TO =
  process.env.PANEL_SUPPORT_EMAIL || "carlos.salfate@chileatiende.cl";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  const typeError = assertJsonContentType(request);
  if (typeError) return typeError;

  if (!isPanelConfigured()) {
    return NextResponse.json({ error: "Panel no configurado." }, { status: 503 });
  }
  if (!(await isPanelAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const parsed = await readJsonLimited<{
    type?: string;
    message?: string;
    page?: string;
    replyEmail?: string;
  }>(request, 20_000);
  if (parsed.error) return parsed.error;

  const type = sanitizeEmailHeader(parsed.data?.type || "ayuda", 40);
  const message = (parsed.data?.message || "").trim().slice(0, 4000);
  const page = sanitizeEmailHeader(parsed.data?.page || "/panel", 60);
  const replyEmail = (parsed.data?.replyEmail || "").trim().slice(0, 254);

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Describe el problema o la necesidad (mínimo 10 caracteres)." },
      { status: 400 }
    );
  }
  if (replyEmail && !EMAIL_RE.test(replyEmail)) {
    return NextResponse.json(
      { error: "El correo de respuesta no es válido." },
      { status: 400 }
    );
  }

  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

  const safe = (v: string) =>
    v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const html = `
    <h2>Solicitud desde el panel Salfate</h2>
    <p><strong>Tipo:</strong> ${safe(type)}</p>
    <p><strong>Sección:</strong> ${safe(page)}</p>
    <p><strong>Responder a:</strong> ${safe(replyEmail || "No indicado")}</p>
    <hr />
    <pre style="white-space:pre-wrap;font-family:sans-serif">${safe(message)}</pre>
  `;

  if (!resend) {
    return NextResponse.json(
      {
        ok: false,
        fallbackMailto: `mailto:${SUPPORT_TO}?subject=${encodeURIComponent(`[Panel] ${type}`)}&body=${encodeURIComponent(message)}`,
        error:
          "Correo automático no configurado (RESEND). Usa el enlace mailto o escribe a Carlos.",
        supportEmail: SUPPORT_TO,
      },
      { status: 503 }
    );
  }

  const { error } = await resend.emails.send({
    from: `Panel Salfate <${from}>`,
    to: [SUPPORT_TO],
    replyTo: replyEmail || undefined,
    subject: `[Panel Salfate] ${type} — ayuda web`,
    html,
  });

  if (error) {
    console.error("[panel/help]", error);
    return NextResponse.json(
      {
        error:
          "No se pudo notificar a Carlos. Intenta de nuevo o escribe a " +
          SUPPORT_TO,
        supportEmail: SUPPORT_TO,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Listo. Carlos fue notificado en ${SUPPORT_TO}.`,
    supportEmail: SUPPORT_TO,
  });
}
