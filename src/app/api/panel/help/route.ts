import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isPanelAuthenticated, isPanelConfigured } from "@/lib/panel/auth";

export const runtime = "nodejs";

const SUPPORT_TO =
  process.env.PANEL_SUPPORT_EMAIL || "carlos.salfate@chileatiende.cl";

export async function POST(request: Request) {
  if (!isPanelConfigured()) {
    return NextResponse.json({ error: "Panel no configurado." }, { status: 503 });
  }
  if (!(await isPanelAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: {
    type?: string;
    message?: string;
    page?: string;
    replyEmail?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const type = (body.type || "ayuda").trim();
  const message = (body.message || "").trim();
  const page = (body.page || "/panel").trim();
  const replyEmail = (body.replyEmail || "").trim();

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Describe el problema o la necesidad (mínimo 10 caracteres)." },
      { status: 400 }
    );
  }

  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

  const safe = (v: string) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
        error: "No se pudo notificar a Carlos. Intenta de nuevo o escribe a " + SUPPORT_TO,
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
