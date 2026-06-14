import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { ContactFormPayload } from "@/lib/content/types";
import { defaultSiteContent } from "@/lib/content/defaults";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactFormPayload;
    const { name, email, phone, caseType, message } = body;

    if (!name?.trim() || !email?.trim() || !caseType?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Complete los campos obligatorios." },
        { status: 400 }
      );
    }

    const to =
      process.env.CONTACT_TO_EMAIL || defaultSiteContent.contact.email;
    const from =
      process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    const html = `
      <h2>Nueva consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(phone || "No indicado")}</p>
      <p><strong>Tipo de caso:</strong> ${escapeHtml(caseType)}</p>
      <hr />
      <p><strong>Mensaje:</strong></p>
      <pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(message)}</pre>
    `;

    if (!resend) {
      console.warn(
        "[contact] RESEND_API_KEY no configurada. Consulta no enviada:",
        { name, email, caseType }
      );
      return NextResponse.json(
        {
          error:
            "Servicio de correo no configurado. Contacte por WhatsApp o correo directo.",
        },
        { status: 503 }
      );
    }

    const { error } = await resend.emails.send({
      from: `Salfate Abogados <${from}>`,
      to: [to],
      replyTo: email,
      subject: `[Web] ${caseType} — ${name}`,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "No se pudo enviar el correo. Intente más tarde." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
