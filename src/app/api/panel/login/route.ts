import { NextResponse } from "next/server";
import {
  createSessionToken,
  isPanelConfigured,
  PANEL_COOKIE,
  verifyPassword,
} from "@/lib/panel/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isPanelConfigured()) {
    return NextResponse.json(
      {
        error:
          "El panel aún no está configurado. Agrega ADMIN_PASSWORD en Vercel.",
      },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() || "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!verifyPassword(password)) {
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
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return res;
}
