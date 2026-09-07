export type AssistantReply = {
  role: "assistant" | "user";
  text: string;
};

export function replyToAssistantPrompt(prompt: string): string {
  const q = prompt.toLowerCase().trim();

  if (!q) {
    return "¿En qué te ayudo? Puedo orientarte para editar textos, contacto, especialidades, o avisar a Carlos si hay un error.";
  }

  if (/(error|bug|falla|no funciona|roto|caíd)/.test(q)) {
    return "Si ves un error en la web o en el panel, descríbelo en «Ayuda / Reportar» y se enviará automáticamente a Carlos (carlos.salfate@chileatiende.cl). Incluye qué estabas editando y qué viste en pantalla.";
  }

  if (/(correo|email|mail)/.test(q)) {
    return "Ve a Contacto y cambia el campo Correo. Luego Guarda. En 1–2 minutos se refleja en footer, botones y chat. Si también quieres que el formulario llegue ahí, Carlos debe actualizar CONTACT_TO_EMAIL en Vercel.";
  }

  if (/(tel[eé]fono|whatsapp|fono)/.test(q)) {
    return "En Contacto edita Teléfono visible (lo que se muestra) y WhatsApp solo números (ej. 56991545512). Guarda y espera el deploy.";
  }

  if (/(especialidad|área|area|practica)/.test(q)) {
    return "En Especialidades puedes cambiar títulos y descripciones de cada área, o agregar/quitar ítems. Usa el preview para ver cómo queda el tono.";
  }

  if (/(ortograf|corrector|revisa)/.test(q)) {
    return "Selecciona una sección, pulsa «Revisar ortografía» y te marcaré sugerencias en español. Puedes aplicar un reemplazo con un clic.";
  }

  if (/(preview|vista previa|c[oó]mo se ve)/.test(q)) {
    return "Activa Vista previa (ojo) a la derecha: verás el hero y el bloque de contacto con tus cambios en vivo, antes de guardar.";
  }

  if (/(guardar|publicar|deploy)/.test(q)) {
    return "Al guardar se publica un cambio en el repositorio y Vercel actualiza la web en 1–2 minutos. Si falla el guardado, revisa el token de GitHub o reporta a Carlos.";
  }

  if (/(seo|google)/.test(q)) {
    return "En SEO edita el título y la descripción que aparecen en Google. Mantén la descripción cerca de 150–160 caracteres.";
  }

  if (/(carlos|ayuda|soporte|contact)/.test(q)) {
    return "Abre la pestaña Asistente → «Pedir ayuda a Carlos». Él recibe el mensaje en carlos.salfate@chileatiende.cl.";
  }

  return "Puedo ayudarte a editar cualquier texto del sitio (inicio, audiencia, especialidades, metodología, FAQ, chat, pie). Dime qué sección quieres cambiar, o reporta un problema a Carlos desde el botón de ayuda.";
}

export const assistantStarters = [
  "¿Cómo cambio el correo?",
  "Revisar ortografía del inicio",
  "Hay un error en la web",
  "¿Cómo veo el preview?",
];
