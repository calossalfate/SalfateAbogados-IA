import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PANEL_COOKIE = "salfate_panel_session";
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 horas (antes 12)
const SESSION_VERSION = "v2";

function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value ? value : null;
}

/** Secreto de firma de sesión (no usar la contraseña en crudo). */
function getSigningSecret(): string | null {
  const dedicated = process.env.PANEL_SECRET?.trim();
  if (dedicated) return dedicated;
  const password = getAdminPassword();
  if (!password) return null;
  // Derivación estable: si alguien filtra solo el JWT no obtiene la password.
  return createHash("sha256")
    .update(`salfate-panel-signing:${password}`)
    .digest("hex");
}

export function isPanelConfigured(): boolean {
  return Boolean(getAdminPassword());
}

function sha256Buffer(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Comparación en tiempo constante (evita filtrar longitud de la clave). */
export function verifyPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected || !password) return false;
  const a = sha256Buffer(password);
  const b = sha256Buffer(expected);
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const secret = getSigningSecret();
  if (!secret) throw new Error("ADMIN_PASSWORD no configurada");
  const exp = Date.now() + SESSION_TTL_MS;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${SESSION_VERSION}.${exp}.${nonce}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = getSigningSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [version, expStr, nonce, sig] = parts;
  if (version !== SESSION_VERSION) return false;
  if (!/^[a-f0-9]{32}$/.test(nonce)) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${version}.${expStr}.${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isPanelAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(PANEL_COOKIE)?.value);
}

export const PANEL_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: Math.floor(SESSION_TTL_MS / 1000),
};
