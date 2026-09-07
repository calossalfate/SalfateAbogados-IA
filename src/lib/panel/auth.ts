import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PANEL_COOKIE = "salfate_panel_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

function getSecret(): string | null {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.PANEL_SECRET ||
    null
  );
}

export function isPanelConfigured(): boolean {
  return Boolean(getSecret());
}

export function verifyPassword(password: string): boolean {
  const expected = getSecret();
  if (!expected || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_PASSWORD no configurada");
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `ok.${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, expStr, sig] = parts;
  if (ok !== "ok") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${ok}.${expStr}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isPanelAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(PANEL_COOKIE)?.value);
}
