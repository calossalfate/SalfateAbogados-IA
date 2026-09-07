import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_HOST_SUFFIXES = [
  "salfateabogados.cl",
  "vercel.app",
  "localhost",
  "127.0.0.1",
];

/**
 * Defensa CSRF: en mutaciones del panel exige Origin/Referer del mismo sitio.
 * SameSite=strict ya ayuda; esto cubre clientes raros o cookies mal configuradas.
 */
export function assertSameOrigin(request: Request): NextResponse | null {
  if (process.env.NODE_ENV !== "production") return null;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const candidate = origin || referer;
  if (!candidate) {
    return NextResponse.json(
      { error: "Origen de solicitud no permitido." },
      { status: 403 }
    );
  }

  try {
    const host = new URL(candidate).hostname.toLowerCase();
    const ok = ALLOWED_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`)
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Origen de solicitud no permitido." },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Origen de solicitud no permitido." },
      { status: 403 }
    );
  }

  return null;
}

export function assertJsonContentType(request: Request): NextResponse | null {
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type inválido." },
      { status: 415 }
    );
  }
  return null;
}

export async function readJsonLimited<T>(
  request: Request,
  maxBytes: number
): Promise<{ data?: T; error?: NextResponse }> {
  const raw = await request.text();
  if (raw.length > maxBytes) {
    return {
      error: NextResponse.json(
        { error: "Payload demasiado grande." },
        { status: 413 }
      ),
    };
  }
  try {
    return { data: JSON.parse(raw) as T };
  } catch {
    return {
      error: NextResponse.json({ error: "JSON inválido." }, { status: 400 }),
    };
  }
}

/** Utilidad por si se necesita en middleware con NextRequest. */
export function requestHostAllowed(request: NextRequest): boolean {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (!host) return false;
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`)
  );
}
