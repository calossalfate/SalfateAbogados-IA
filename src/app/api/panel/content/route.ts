import { NextResponse } from "next/server";
import {
  getEditableFromModule,
  sanitizeEditable,
} from "@/lib/content/editable";
import { isPanelAuthenticated, isPanelConfigured } from "@/lib/panel/auth";
import { canPersistEditable, saveEditableContent } from "@/lib/panel/persist";

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

  return NextResponse.json({
    content: getEditableFromModule(),
    canSave: canPersistEditable(),
  });
}

export async function PUT(request: Request) {
  if (!isPanelConfigured()) {
    return NextResponse.json(
      { error: "Panel no configurado (falta ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  if (!(await isPanelAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

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
  });
}
