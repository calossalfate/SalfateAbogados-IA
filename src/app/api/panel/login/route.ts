import { NextResponse } from "next/server";
import {
  createSessionToken,
  isPanelConfigured,
  PANEL_COOKIE,
  PANEL_COOKIE_OPTIONS,
  verifyPassword,
} from "@/lib/panel/auth";
import {
  assertJsonContentType,
  assertSameOrigin,
  readJsonLimited,
} from "@/lib/panel/requestGuard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  const typeError = assertJsonContentType(request);
  if (typeError) return typeError;

  if (!isPanelConfigured()) {
    return NextResponse.json(
      {
        error:
          "El panel aún no está configurado. Agrega ADMIN_PASSWORD en Vercel.",
      },
      { status: 503 }
    );
  }

  const parsed = await readJsonLimited<{ password?: string }>(request, 2_000);
  if (parsed.error) return parsed.error;
  const password = parsed.data?.password?.trim() || "";

  if (!verifyPassword(password)) {
    // Misma forma de respuesta para no filtrar detalles
    return NextResponse.json(
      { error: "Contraseña incorrecta." },
      { status: 401 }
    );
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: PANEL_COOKIE,
    value: token,
    ...PANEL_COOKIE_OPTIONS,
  });
  return res;
}
