import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";

const CONTACT_RATE_LIMIT = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const PANEL_LOGIN_RATE_LIMIT = 5;
const PANEL_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const PANEL_WRITE_RATE_LIMIT = 30;
const PANEL_WRITE_WINDOW_MS = 15 * 60 * 1000;
const PANEL_HELP_RATE_LIMIT = 8;
const PANEL_SPELL_RATE_LIMIT = 20;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function tooMany(retryAfterSec: number, message: string) {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(retryAfterSec, 1)),
      },
    }
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);
  const method = request.method;

  if (pathname === "/api/contact" && method === "POST") {
    const result = checkRateLimit(
      `contact:${ip}`,
      CONTACT_RATE_LIMIT,
      CONTACT_WINDOW_MS
    );
    if (!result.allowed) {
      return tooMany(
        Math.ceil((result.resetAt - Date.now()) / 1000),
        "Demasiadas solicitudes. Espere unos minutos e intente de nuevo."
      );
    }
  }

  if (pathname === "/api/panel/login" && method === "POST") {
    const result = checkRateLimit(
      `panel-login:${ip}`,
      PANEL_LOGIN_RATE_LIMIT,
      PANEL_LOGIN_WINDOW_MS
    );
    if (!result.allowed) {
      return tooMany(
        Math.ceil((result.resetAt - Date.now()) / 1000),
        "Demasiados intentos. Espere unos minutos."
      );
    }
  }

  if (pathname === "/api/panel/content" && method === "PUT") {
    const result = checkRateLimit(
      `panel-write:${ip}`,
      PANEL_WRITE_RATE_LIMIT,
      PANEL_WRITE_WINDOW_MS
    );
    if (!result.allowed) {
      return tooMany(
        Math.ceil((result.resetAt - Date.now()) / 1000),
        "Demasiados guardados. Espere unos minutos."
      );
    }
  }

  if (pathname === "/api/panel/help" && method === "POST") {
    const result = checkRateLimit(
      `panel-help:${ip}`,
      PANEL_HELP_RATE_LIMIT,
      PANEL_WRITE_WINDOW_MS
    );
    if (!result.allowed) {
      return tooMany(
        Math.ceil((result.resetAt - Date.now()) / 1000),
        "Demasiados reportes. Espere unos minutos."
      );
    }
  }

  if (pathname === "/api/panel/spellcheck" && method === "POST") {
    const result = checkRateLimit(
      `panel-spell:${ip}`,
      PANEL_SPELL_RATE_LIMIT,
      PANEL_WRITE_WINDOW_MS
    );
    if (!result.allowed) {
      return tooMany(
        Math.ceil((result.resetAt - Date.now()) / 1000),
        "Demasiadas revisiones. Espere unos minutos."
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/contact",
    "/api/panel/login",
    "/api/panel/content",
    "/api/panel/help",
    "/api/panel/spellcheck",
  ],
};
