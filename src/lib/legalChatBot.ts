import {
  diagnoseLegalCase,
  DIAGNOSTIC_STORAGE_KEY,
  type LegalDiagnosticResult,
} from "@/lib/legalAIDiagnostic";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
};

export type ChatContext = {
  lastDiagnostic: LegalDiagnosticResult | null;
};

export type ChatReply = {
  content: string;
  quickReplies: string[];
  diagnostic: LegalDiagnosticResult | null;
  navigateTo?: string;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function matches(text: string, patterns: string[]): boolean {
  const n = normalize(text);
  return patterns.some((p) => n.includes(normalize(p)));
}

function isGreeting(text: string): boolean {
  const n = normalize(text);
  return (
    n.length < 40 &&
    /^(hola|buenas|buenos dias|buenas tardes|buenas noches|saludos|hey|hi|hello)\b/.test(
      n
    )
  );
}

function isThanks(text: string): boolean {
  return matches(text, [
    "gracias",
    "muchas gracias",
    "te agradezco",
    "perfecto gracias",
    "genial gracias",
  ]);
}

function isFarewell(text: string): boolean {
  const n = normalize(text);
  return (
    n.length < 50 &&
    matches(text, ["chao", "adios", "hasta luego", "nos vemos", "bye"])
  );
}

function isHelpRequest(text: string): boolean {
  return matches(text, [
    "ayuda",
    "que puedes hacer",
    "que haces",
    "como funciona",
    "como te uso",
    "opciones",
    "menu",
  ]);
}

function isContactRequest(text: string): boolean {
  return matches(text, [
    "contacto",
    "contactar",
    "telefono",
    "whatsapp",
    "correo",
    "email",
    "llamar",
    "escribir",
    "agendar",
    "cita",
    "reunion",
  ]);
}

function isSpecialtiesRequest(text: string): boolean {
  return matches(text, [
    "especialidades",
    "areas",
    "servicios",
    "que hacen",
    "en que se especializan",
    "materias",
  ]);
}

function isDocumentsRequest(text: string): boolean {
  return matches(text, [
    "documentos",
    "documentacion",
    "que debo enviar",
    "que necesitan",
    "que debo llevar",
    "que papeles",
  ]);
}

function isNavigationRequest(text: string): boolean {
  return matches(text, [
    "diagnostico",
    "formulario",
    "metodologia",
    "faq",
    "preguntas frecuentes",
    "ir a",
    "mostrar",
    "donde esta",
  ]);
}

function isLegalCase(text: string): boolean {
  if (text.trim().length >= 40) return true;
  return matches(text, [
    "licitacion",
    "licitación",
    "sumario",
    "despido",
    "municipalidad",
    "patente",
    "contraloria",
    "contraloría",
    "laboral",
    "finiquito",
    "demanda",
    "juicio",
    "recurso",
    "impugnacion",
    "impugnación",
    "funcionario",
    "tutela",
    "fiscalizacion",
    "fiscalización",
    "transparencia",
    "lobby",
    "chilecompra",
    "oferta",
    "bases",
    "despido",
    "trabajador",
    "empleador",
    "custodia",
    "divorcio",
    "penal",
    "civil",
  ]);
}

function formatDiagnostic(result: LegalDiagnosticResult): string {
  const docs = result.documents.map((d) => `• ${d}`).join("\n");
  const actions = result.actions.map((a) => `• ${a}`).join("\n");

  return [
    "He analizado su relato de forma preliminar:",
    "",
    `Materia: ${result.categoryLabel}`,
    `Urgencia: ${result.urgency}`,
    "",
    "Documentación que debe preparar:",
    result.documentationRequest,
    "",
    docs,
    "",
    "Posibles vías de acción:",
    actions,
    "",
    `Recomendación: ${result.recommendation}`,
    "",
    "Este análisis es orientativo y no reemplaza la asesoría de un abogado. Si desea una revisión profesional, escriba «contacto» o use el botón de abajo.",
  ].join("\n");
}

function persistDiagnostic(result: LegalDiagnosticResult, userText: string) {
  try {
    sessionStorage.setItem(
      DIAGNOSTIC_STORAGE_KEY,
      JSON.stringify({ result, userText, savedAt: Date.now() })
    );
  } catch {
    /* sessionStorage no disponible */
  }
}

function welcomeMessage(): ChatReply {
  return {
    content:
      "Hola, soy el asistente de Salfate Abogados. Puedo orientarle sobre su caso, indicarle qué documentación reunir y guiarle por el sitio.\n\nDescriba su situación con detalle o elija una opción:",
    quickReplies: [
      "Analizar mi caso",
      "Ver especialidades",
      "Contactar abogado",
      "¿Qué documentos necesito?",
    ],
    diagnostic: null,
  };
}

function helpMessage(): ChatReply {
  return {
    content:
      "Puedo ayudarle con lo siguiente:\n\n• Analizar su caso legal de forma preliminar\n• Indicar documentación necesaria según la materia\n• Orientar sobre compras públicas, sumarios, municipal, laboral y más\n• Conectarle con el formulario de contacto\n\nPara un análisis, describa su situación: qué ocurrió, con qué organismo o empresa, y si hay plazos próximos.",
    quickReplies: [
      "Analizar mi caso",
      "Ver especialidades",
      "Contactar abogado",
    ],
    diagnostic: null,
  };
}

function contactMessage(): ChatReply {
  return {
    content:
      "Puede contactarnos por estos medios:\n\n• Correo: info@salfateabogados.cl\n• WhatsApp: +56 9 9154 5512\n• Cobertura: todo Chile\n\nTambién puede completar el formulario en la sección Contacto. Si ya realizó un diagnóstico aquí, el formulario se completará con sus datos.",
    quickReplies: ["Ir a contacto", "Analizar mi caso"],
    diagnostic: null,
    navigateTo: "contacto",
  };
}

function specialtiesMessage(): ChatReply {
  return {
    content:
      "Salfate Abogados trabaja en:\n\n• Compras públicas y licitaciones\n• Sumarios administrativos\n• Derecho municipal (patentes, fiscalización, permisos)\n• Reclamaciones ante Contraloría y superintendencias\n• Derecho laboral\n• Civil, penal, familia y consumidor\n• Propiedades, derechos de agua y estudios de títulos\n\n¿Sobre cuál de estas materias necesita orientación?",
    quickReplies: ["Analizar mi caso", "Contactar abogado"],
    diagnostic: null,
  };
}

function documentsMessage(context: ChatContext): ChatReply {
  if (context.lastDiagnostic) {
    const r = context.lastDiagnostic;
    const docs = r.documents.map((d) => `• ${d}`).join("\n");
    return {
      content: [
        `Según su caso (${r.categoryLabel}), debe preparar:`,
        "",
        r.documentationRequest,
        "",
        docs,
        "",
        "Reúna estos antecedentes antes de solicitar la revisión profesional.",
      ].join("\n"),
      quickReplies: ["Contactar abogado", "Analizar otro caso"],
      diagnostic: null,
    };
  }

  return {
    content:
      "La documentación depende de su materia legal. Describa su situación (por ejemplo: licitación rechazada, sumario administrativo, despido laboral) y le indicaré exactamente qué documentos reunir.",
    quickReplies: ["Analizar mi caso", "Ver especialidades"],
    diagnostic: null,
  };
}

function navigationMessage(text: string): ChatReply {
  if (matches(text, ["diagnostico", "ia legal", "analizar"])) {
    return {
      content:
        "Puede usar el diagnóstico completo en la sección «Diagnóstico legal» del sitio, o describir su caso aquí mismo y le entregaré una orientación preliminar.",
      quickReplies: ["Analizar mi caso", "Ir a diagnóstico"],
      diagnostic: null,
    };
  }

  if (matches(text, ["metodologia"])) {
    return {
      content:
        "En la sección Metodología explicamos cómo trabajamos: evaluación inicial, estrategia, ejecución y seguimiento. ¿Desea orientación sobre un caso concreto?",
      quickReplies: ["Analizar mi caso", "Contactar abogado"],
      diagnostic: null,
    };
  }

  if (matches(text, ["faq", "preguntas"])) {
    return {
      content:
        "En Preguntas frecuentes encontrará respuestas sobre cobertura nacional, licitaciones, sumarios y más. ¿Tiene alguna consulta específica que pueda resolver ahora?",
      quickReplies: ["Analizar mi caso", "Contactar abogado"],
      diagnostic: null,
    };
  }

  return {
    content:
      "Secciones del sitio:\n\n• Diagnóstico legal — análisis orientativo\n• Especialidades — áreas de trabajo\n• Metodología — cómo trabajamos\n• Contacto — formulario y datos\n\n¿Qué necesita?",
    quickReplies: ["Analizar mi caso", "Ir a contacto", "Ver especialidades"],
    diagnostic: null,
  };
}

function analyzeCase(text: string): ChatReply {
  const diagnostic = diagnoseLegalCase(text);
  persistDiagnostic(diagnostic, text);

  return {
    content: formatDiagnostic(diagnostic),
    quickReplies: ["Contactar abogado", "¿Qué documentos necesito?", "Analizar otro caso"],
    diagnostic,
  };
}

function handleQuickAction(text: string, context: ChatContext): ChatReply | null {
  const n = normalize(text);

  if (n === "analizar mi caso" || n === "analizar otro caso") {
    return {
      content:
        "Cuénteme su situación con el mayor detalle posible: qué ocurrió, con qué organismo o empresa está involucrado, fechas relevantes y si hay plazos próximos a vencer.",
      quickReplies: [],
      diagnostic: null,
    };
  }

  if (n === "ver especialidades") return specialtiesMessage();
  if (n === "contactar abogado" || n === "ir a contacto") {
    return {
      content:
        "Le he llevado a la sección de contacto. Complete el formulario con sus datos y, si ya analizó su caso aquí, el mensaje se completará automáticamente.\n\nTambién puede escribirnos a info@salfateabogados.cl o por WhatsApp al +56 9 9154 5512.",
      quickReplies: ["Analizar mi caso"],
      diagnostic: null,
      navigateTo: "contacto",
    };
  }

  if (n === "ir a diagnostico") {
    return {
      content:
        "Le he llevado a la sección de diagnóstico legal. Allí puede realizar un análisis más detallado, o continúe conversando aquí.",
      quickReplies: ["Analizar mi caso"],
      diagnostic: null,
      navigateTo: "ia-legal",
    };
  }

  if (n === "que documentos necesito" || n === "¿qué documentos necesito?") {
    return documentsMessage(context);
  }

  return null;
}

export function processChatMessage(
  input: string,
  context: ChatContext
): ChatReply {
  const text = input.trim();
  if (!text) {
    return {
      content: "Escriba su consulta o elija una de las opciones sugeridas.",
      quickReplies: welcomeMessage().quickReplies,
      diagnostic: null,
    };
  }

  const quick = handleQuickAction(text, context);
  if (quick) return quick;

  if (isGreeting(text)) {
    return welcomeMessage();
  }

  if (isHelpRequest(text)) return helpMessage();
  if (isContactRequest(text)) return contactMessage();
  if (isSpecialtiesRequest(text)) return specialtiesMessage();
  if (isDocumentsRequest(text)) return documentsMessage(context);
  if (isNavigationRequest(text)) return navigationMessage(text);

  if (isThanks(text)) {
    return {
      content:
        "De nada. Estoy aquí si necesita más orientación sobre su caso o desea contactar al estudio.",
      quickReplies: ["Analizar mi caso", "Contactar abogado"],
      diagnostic: null,
    };
  }

  if (isFarewell(text)) {
    return {
      content:
        "Hasta pronto. Recuerde que puede volver cuando necesite orientación legal preliminar.",
      quickReplies: [],
      diagnostic: null,
    };
  }

  if (isLegalCase(text)) {
    return analyzeCase(text);
  }

  if (text.length >= 20) {
    return analyzeCase(text);
  }

  return {
    content:
      "Para orientarle mejor, necesito un poco más de contexto. Cuénteme qué ocurrió, con quién (municipalidad, empleador, organismo público, etc.) y si hay plazos urgentes.\n\nTambién puede preguntarme por especialidades, documentos o contacto.",
    quickReplies: [
      "Analizar mi caso",
      "Ver especialidades",
      "Contactar abogado",
    ],
    diagnostic: null,
  };
}

export function createWelcomeChatMessage(): ChatMessage {
  const reply = welcomeMessage();
  return {
    id: "welcome",
    role: "assistant",
    content: reply.content,
    timestamp: Date.now(),
  };
}

export function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
