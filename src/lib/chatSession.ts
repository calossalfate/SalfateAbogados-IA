import type { LegalDiagnosticResult } from "@/lib/legalAIDiagnostic";
import { DIAGNOSTIC_STORAGE_KEY } from "@/lib/legalAIDiagnostic";
import type { ChatMessage } from "@/lib/legalChatBot";

/** Datos del chat persistidos en sessionStorage (duran hasta cerrar la pestaña). */
export type ChatSessionData = {
  userName: string | null;
  awaitingName: boolean;
  messages: ChatMessage[];
  messageCount: number;
  lastDiagnostic: LegalDiagnosticResult | null;
  updatedAt: number;
};

export const CHAT_SESSION_KEY = "salfate-chat-session";

const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 horas de inactividad

export function createEmptySession(): ChatSessionData {
  return {
    userName: null,
    awaitingName: true,
    messages: [],
    messageCount: 0,
    lastDiagnostic: null,
    updatedAt: Date.now(),
  };
}

export function loadChatSession(): ChatSessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CHAT_SESSION_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as ChatSessionData;
    if (!data || typeof data !== "object") return null;

    if (Date.now() - (data.updatedAt ?? 0) > SESSION_TTL_MS) {
      clearChatSession();
      return null;
    }

    return {
      userName: data.userName ?? null,
      awaitingName: data.awaitingName ?? !data.userName,
      messages: Array.isArray(data.messages) ? data.messages : [],
      messageCount: data.messageCount ?? 0,
      lastDiagnostic: data.lastDiagnostic ?? null,
      updatedAt: data.updatedAt ?? Date.now(),
    };
  } catch {
    return null;
  }
}

export function saveChatSession(session: ChatSessionData): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(
      CHAT_SESSION_KEY,
      JSON.stringify({ ...session, updatedAt: Date.now() })
    );
  } catch {
    /* sessionStorage lleno o no disponible */
  }
}

/** Limpia chat y diagnóstico vinculado al formulario de contacto. */
export function clearChatSession(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(CHAT_SESSION_KEY);
    sessionStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
  } catch {
    /* ignorar */
  }
}

const NAME_SKIP = new Set(["omitir", "saltar", "no", "anonimo", "anónimo"]);

export function parseUserName(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || NAME_SKIP.has(trimmed.toLowerCase())) return null;

  const patterns = [
    /^(?:hola,?\s*)?(?:me llamo|soy|mi nombre es)\s+(.+)/i,
    /^me llamo\s+(.+)/i,
    /^soy\s+(.+)/i,
    /^mi nombre es\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return sanitizeName(match[1]);
  }

  if (
    trimmed.length >= 2 &&
    trimmed.length <= 48 &&
    !/\d/.test(trimmed) &&
    !trimmed.includes("@")
  ) {
    return sanitizeName(trimmed);
  }

  return null;
}

function sanitizeName(raw: string): string {
  return raw
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Primer nombre para saludos personalizados. */
export function firstName(userName: string | null): string | null {
  if (!userName) return null;
  return userName.split(/\s+/)[0] ?? null;
}

export function isSessionExpired(session: ChatSessionData): boolean {
  return Date.now() - session.updatedAt > SESSION_TTL_MS;
}
