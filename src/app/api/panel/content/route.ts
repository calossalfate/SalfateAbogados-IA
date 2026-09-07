import { NextResponse } from "next/server";
import {
  computeContentMetrics,
  getEditableFromModule,
  sanitizeEditable,
} from "@/lib/content/editable";
import { isPanelAuthenticated, isPanelConfigured } from "@/lib/panel/auth";
import { canPersistEditable, saveEditableContent } from "@/lib/panel/persist";
import {
  assertJsonContentType,
  assertSameOrigin,
  readJsonLimited,
} from "@/lib/panel/requestGuard";

export const runtime = "nodejs";

export async function GET() {
  if (!isPanelConfigured()) {
    return NextResponse.json(
      { error: "Panel no configurado (falta ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  if (!(await isPanelAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const content = getEditableFromModule();
  return NextResponse.json({
    content,
    canSave: canPersistEditable(),
    metrics: computeContentMetrics(content),
    supportEmail:
      process.env.PANEL_SUPPORT_EMAIL || "carlos.salfate@chileatiende.cl",
  });
}

export async function PUT(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  const typeError = assertJsonContentType(request);
  if (typeError) return typeError;

  if (!isPanelConfigured()) {
    return NextResponse.json(
      { error: "Panel no configurado (falta ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  if (!(await isPanelAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const parsed = await readJsonLimited<{ content?: unknown } | unknown>(
    request,
    350_000
  );
  if (parsed.error) return parsed.error;

  const body = parsed.data;
  const content = sanitizeEditable(
    (body as { content?: unknown })?.content ?? body
  );
  if (!content) {
    return NextResponse.json(
      { error: "Revisa correo, teléfono visible y WhatsApp: son obligatorios." },
      { status: 400 }
    );
  }

  const result = await saveEditableContent(content);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: result.mode,
    message: result.message,
    content,
    metrics: computeContentMetrics(content),
  });
}
