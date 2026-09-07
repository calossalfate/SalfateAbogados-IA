import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";

const CONTACT_RATE_LIMIT = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const PANEL_LOGIN_RATE_LIMIT = 10;
const PANEL_LOGIN_WINDOW_MS = 15 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  if (pathname === "/api/contact" && request.method === "POST") {
    const result = checkRateLimit(
      `contact:${ip}`,
      CONTACT_RATE_LIMIT,
      CONTACT_WINDOW_MS
    );

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error:
            "Demasiadas solicitudes. Espere unos minutos e intente de nuevo.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(retryAfter, 1)),
          },
        }
      );
    }
  }

  if (pathname === "/api/panel/login" && request.method === "POST") {
    const result = checkRateLimit(
      `panel-login:${ip}`,
      PANEL_LOGIN_RATE_LIMIT,
      PANEL_LOGIN_WINDOW_MS
    );
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Demasiados intentos. Espere unos minutos." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(retryAfter, 1)),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/contact", "/api/panel/login"],
};
