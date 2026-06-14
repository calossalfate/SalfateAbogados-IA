const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CONTROL_CHARS_RE = /[\x00-\x1f\x7f]/;

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  phone: 30,
  caseType: 80,
  message: 5000,
} as const;

export type ContactValidationError = {
  field: string;
  message: string;
};

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  caseType: string;
  message: string;
  website?: string;
};

function stripControlChars(value: string): string {
  return value.replace(CONTROL_CHARS_RE, "").trim();
}

export function sanitizeContactInput(raw: ContactInput): ContactInput {
  return {
    name: stripControlChars(raw.name ?? ""),
    email: stripControlChars(raw.email ?? "").toLowerCase(),
    phone: raw.phone ? stripControlChars(raw.phone) : undefined,
    caseType: stripControlChars(raw.caseType ?? ""),
    message: stripControlChars(raw.message ?? ""),
    website: raw.website?.trim(),
  };
}

export function validateContactInput(
  input: ContactInput
): ContactValidationError | null {
  if (input.website) {
    return { field: "website", message: "Solicitud rechazada." };
  }

  if (!input.name) {
    return { field: "name", message: "El nombre es obligatorio." };
  }
  if (input.name.length > CONTACT_LIMITS.name) {
    return { field: "name", message: "El nombre es demasiado largo." };
  }

  if (!input.email) {
    return { field: "email", message: "El email es obligatorio." };
  }
  if (input.email.length > CONTACT_LIMITS.email || !EMAIL_RE.test(input.email)) {
    return { field: "email", message: "Ingrese un email válido." };
  }

  if (input.phone && input.phone.length > CONTACT_LIMITS.phone) {
    return { field: "phone", message: "El teléfono es demasiado largo." };
  }

  if (!input.caseType) {
    return { field: "caseType", message: "Seleccione un tipo de caso." };
  }
  if (input.caseType.length > CONTACT_LIMITS.caseType) {
    return { field: "caseType", message: "Tipo de caso no válido." };
  }

  if (!input.message) {
    return { field: "message", message: "El mensaje es obligatorio." };
  }
  if (input.message.length > CONTACT_LIMITS.message) {
    return { field: "message", message: "El mensaje es demasiado largo." };
  }

  return null;
}

/** Evita inyección de cabeceras en subject/replyTo de correo. */
export function sanitizeEmailHeader(value: string, maxLength = 120): string {
  return value
    .replace(CONTROL_CHARS_RE, "")
    .replace(/[\r\n]/g, " ")
    .trim()
    .slice(0, maxLength);
}
