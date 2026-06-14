import {
  diagnoseLegalCase,
  DIAGNOSTIC_STORAGE_KEY,
  type LegalCategoryId,
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
  messageCount: number;
};

export type ChatReply = {
  content: string;
  quickReplies: string[];
  diagnostic: LegalDiagnosticResult | null;
  navigateTo?: string;
};

export const TEASER_MESSAGES = [
  "¿En qué puedo ayudarte?",
  "Cuénteme su situación legal",
  "Le oriento sobre su caso",
  "¿Tiene un plazo próximo?",
  "Le indico qué documentos reunir",
  "Asesoría inicial orientativa",
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function pickVariant<T>(variants: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) | 0;
  }
  return variants[Math.abs(hash) % variants.length];
}

function matches(text: string, patterns: string[]): boolean {
  const n = normalize(text);
  return patterns.some((p) => n.includes(normalize(p)));
}

export function computeTypingDelay(text: string): number {
  const base = 500;
  const perChar = 12;
  return Math.min(base + text.length * perChar, 2400);
}

function isGreeting(text: string): boolean {
  const n = normalize(text);
  return (
    n.length < 45 &&
    /^(hola|buenas|buenos dias|buenas tardes|buenas noches|saludos|hey|hi|hello|que tal|como estas)\b/.test(
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
    "muy amable",
    "excelente",
  ]);
}

function isFarewell(text: string): boolean {
  const n = normalize(text);
  return (
    n.length < 55 &&
    matches(text, [
      "chao",
      "adios",
      "hasta luego",
      "nos vemos",
      "bye",
      "me voy",
    ])
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
    "para que sirves",
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
    "hablar con abogado",
    "consulta",
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
    "que tipo de casos",
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
    "que antecedentes",
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
    "seccion",
  ]);
}

function isAboutRequest(text: string): boolean {
  return matches(text, [
    "quienes son",
    "quien es salfate",
    "sobre el estudio",
    "sobre ustedes",
    "conocer el estudio",
    "abogados salfate",
  ]);
}

function isPricingRequest(text: string): boolean {
  return matches(text, [
    "costo",
    "costos",
    "precio",
    "precios",
    "cuanto cobran",
    "honorarios",
    "cuanto sale",
    "es gratis",
    "gratis",
    "tarifa",
  ]);
}

function isUrgencyQuestion(text: string): boolean {
  return matches(text, [
    "es urgente",
    "tengo plazo",
    "plazo venc",
    "corre prisa",
    "es grave",
    "que tan urgente",
  ]);
}

function isAffirmative(text: string): boolean {
  const n = normalize(text);
  return (
    n.length < 25 &&
    /^(si|sí|ok|okay|vale|de acuerdo|entendido|perfecto|claro|bueno)\b/.test(n)
  );
}

function isLegalCase(text: string): boolean {
  if (text.trim().length >= 40) return true;
  return matches(text, [
    "licitacion",
    "sumario",
    "despido",
    "municipalidad",
    "patente",
    "contraloria",
    "laboral",
    "finiquito",
    "demanda",
    "juicio",
    "recurso",
    "impugnacion",
    "funcionario",
    "tutela",
    "fiscalizacion",
    "transparencia",
    "lobby",
    "chilecompra",
    "oferta",
    "bases",
    "trabajador",
    "empleador",
    "custodia",
    "divorcio",
    "penal",
    "civil",
    "notificacion",
    "citacion",
    "sancion",
    "multa",
    "reclamo",
  ]);
}

const DIAGNOSTIC_INTROS: Record<LegalCategoryId, string[]> = {
  compras_publicas: [
    "Revisé su relato en materia de compras públicas. Esto es lo que observo:",
    "Por lo que describe, parece tratarse de un asunto de licitación o compra pública:",
    "Analicé su situación en el ámbito de contratación pública. Le comparto una orientación inicial:",
  ],
  sumario: [
    "Lo que relata encaja con un procedimiento disciplinario o sumario administrativo. Le detallo:",
    "En sumarios el tiempo juega un rol clave. Esto es lo que veo en su caso:",
    "Revisé su situación desde la perspectiva de un sumario administrativo:",
  ],
  municipal: [
    "Por su descripción, el conflicto parece vinculado a una municipalidad o acto municipal:",
    "Analicé su relato en derecho administrativo municipal. Esto es relevante:",
    "Lo que comenta suele encuadrarse en fiscalización o trámites municipales:",
  ],
  reclamacion_admin: [
    "Su situación apunta a una reclamación o fiscalización administrativa:",
    "Revisé su caso en el marco de procedimientos ante organismos fiscalizadores:",
    "Por lo que indica, podría tratarse de un acto u omisión reclamable administrativamente:",
  ],
  laboral: [
    "Lo que describe tiene características de un conflicto laboral:",
    "Revisé su relato desde el ángulo del derecho del trabajo:",
    "Por los antecedentes que menciona, esto parece un asunto laboral:",
  ],
  general: [
    "Revisé su situación en el ámbito legal general que describe:",
    "Por lo que comenta, esto podría encuadrarse en varias vías jurídicas. Le oriento así:",
    "Analicé su relato y esto es lo que resulta preliminarmente:",
  ],
  inicial: [
    "Con la información disponible aún no puedo clasificar el caso con total precisión, pero le oriento así:",
    "Necesitaría más antecedentes para afinar la materia, pero esto es un buen punto de partida:",
    "Su relato requiere una evaluación más detallada. De momento, le sugiero lo siguiente:",
  ],
};

function formatDiagnostic(result: LegalDiagnosticResult, seed: string): string {
  const intro = pickVariant(DIAGNOSTIC_INTROS[result.categoryId], seed);
  const docs = result.documents.map((d) => `• ${d}`).join("\n");
  const actions = result.actions.map((a) => `• ${a}`).join("\n");

  const urgencyNote =
    result.urgency === "Alto"
      ? "Dado el nivel de urgencia detectado, conviene actuar pronto."
      : result.urgency === "Medio"
        ? "Hay elementos que ameritan revisión en un plazo razonable."
        : "Por ahora no detecto señales de extrema urgencia, pero conviene no demorar la evaluación.";

  const closings = [
    "Si lo desea, puedo indicarle cómo contactar al estudio para una revisión profesional.",
    "¿Quiere que le indique qué documentos priorizar o prefiere ir directo al contacto?",
    "Puede pedirme los documentos necesarios o escribir «contacto» para agendar revisión.",
  ];

  return [
    intro,
    "",
    `Materia: ${result.categoryLabel}`,
    `Urgencia estimada: ${result.urgency}`,
    urgencyNote,
    "",
    "Documentación que conviene reunir:",
    result.documentationRequest,
    "",
    docs,
    "",
    "Vías de acción a considerar:",
    actions,
    "",
    `Mi recomendación: ${result.recommendation}`,
    "",
    pickVariant(closings, seed + result.categoryId),
    "",
    "Recuerde: esto es orientación preliminar, no reemplaza la opinión de un abogado.",
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

function welcomeMessage(seed: string): ChatReply {
  const greetings = [
    "Hola, soy el asistente de Salfate Abogados. Estoy aquí para orientarle sobre su caso, indicarle qué documentos reunir y guiarle por el sitio.",
    "Bienvenido. Puedo ayudarle a entender en qué materia encaja su situación y qué pasos conviene evaluar primero.",
    "Hola. Cuénteme qué ocurre y le daré una orientación legal inicial basada en su relato.",
  ];

  return {
    content: `${pickVariant(greetings, seed)}\n\n¿Por dónde le gustaría empezar?`,
    quickReplies: [
      "Analizar mi caso",
      "Ver especialidades",
      "Contactar abogado",
      "¿Qué documentos necesito?",
    ],
    diagnostic: null,
  };
}

function helpMessage(seed: string): ChatReply {
  const intros = [
    "Con gusto le explico. Puedo orientarle en varias materias del estudio:",
    "Estoy preparado para ayudarle con lo siguiente:",
    "Puedo asistirle de distintas formas según lo que necesite:",
  ];

  return {
    content: [
      pickVariant(intros, seed),
      "",
      "• Analizar su caso y estimar urgencia",
      "• Indicar documentación según la materia",
      "• Orientar en compras públicas, sumarios, municipal, laboral y más",
      "• Conectarle con el formulario de contacto",
      "",
      "Para un análisis útil, cuénteme qué ocurrió, con qué organismo o empresa está involucrado y si hay plazos próximos.",
    ].join("\n"),
    quickReplies: [
      "Analizar mi caso",
      "Ver especialidades",
      "Contactar abogado",
    ],
    diagnostic: null,
  };
}

function contactMessage(seed: string): ChatReply {
  const intros = [
    "Claro, estos son los canales para contactar al estudio:",
    "Puede comunicarse con nosotros por cualquiera de estos medios:",
    "Le dejo los datos de contacto del estudio:",
  ];

  return {
    content: [
      pickVariant(intros, seed),
      "",
      "• Correo: info@salfateabogados.cl",
      "• WhatsApp: +56 9 9154 5512",
      "• Cobertura: todo Chile",
      "",
      "Si ya analizó su caso aquí, el formulario de contacto se completará con esa información.",
    ].join("\n"),
    quickReplies: ["Ir a contacto", "Analizar mi caso"],
    diagnostic: null,
    navigateTo: "contacto",
  };
}

function specialtiesMessage(seed: string): ChatReply {
  return {
    content: [
      pickVariant(
        [
          "Salfate Abogados concentra su trabajo en estas áreas:",
          "Estas son las principales materias que atendemos:",
          "El estudio trabaja especialmente en:",
        ],
        seed
      ),
      "",
      "• Compras públicas y licitaciones",
      "• Sumarios administrativos",
      "• Derecho municipal (patentes, fiscalización, permisos)",
      "• Reclamaciones ante Contraloría y superintendencias",
      "• Derecho laboral",
      "• Civil, penal, familia y consumidor",
      "• Propiedades, derechos de agua y estudios de títulos",
      "",
      "¿Cuál de estas materias se acerca más a su situación?",
    ].join("\n"),
    quickReplies: ["Analizar mi caso", "Contactar abogado"],
    diagnostic: null,
  };
}

function aboutMessage(seed: string): ChatReply {
  return {
    content: [
      pickVariant(
        [
          "Salfate Abogados es un estudio jurídico chileno especializado en Derecho Público y Administrativo.",
          "Somos un estudio orientado a la defensa y asesoría frente al Estado y organismos públicos.",
          "El estudio acompaña a personas, empresas, funcionarios e instituciones en conflictos legales complejos.",
        ],
        seed
      ),
      "",
      "Trabajamos compras públicas, sumarios, litigación, municipal, laboral y otras materias. Atendemos en todo Chile.",
      "",
      "¿Le gustaría contarme su caso para orientarle de forma preliminar?",
    ].join("\n"),
    quickReplies: ["Analizar mi caso", "Ver especialidades", "Contactar abogado"],
    diagnostic: null,
  };
}

function pricingMessage(seed: string): ChatReply {
  return {
    content: [
      pickVariant(
        [
          "Los honorarios dependen de la complejidad, etapa procesal y urgencia de cada caso.",
          "No existe un monto único: cada asunto requiere evaluar alcance, documentación y estrategia.",
          "El costo se define tras revisar los antecedentes y entender qué necesita concretamente.",
        ],
        seed
      ),
      "",
      "Este asistente puede orientarle sin costo de forma preliminar. Para una cotización o plan de trabajo, lo ideal es una revisión profesional con un abogado del estudio.",
    ].join("\n"),
    quickReplies: ["Analizar mi caso", "Contactar abogado"],
    diagnostic: null,
  };
}

function urgencyMessage(context: ChatContext, seed: string): ChatReply {
  if (context.lastDiagnostic) {
    const r = context.lastDiagnostic;
    const urgencyTexts: Record<string, string> = {
      Alto: "Según su caso previo, hay señales de urgencia alta. Le recomiendo contactar al estudio pronto y reunir la documentación indicada.",
      Medio: "Su caso tiene urgencia media. Conviene actuar en los próximos días sin esperar demasiado.",
      Bajo: "Por ahora la urgencia parece moderada, pero aun así conviene evaluar pronto para no perder plazos.",
    };
    return {
      content: urgencyTexts[r.urgency] ?? urgencyTexts.Medio,
      quickReplies: ["Contactar abogado", "¿Qué documentos necesito?"],
      diagnostic: null,
    };
  }

  return {
    content: pickVariant(
      [
        "Para evaluar la urgencia necesito conocer su situación. ¿Hay una notificación, plazo o acto reciente?",
        "La urgencia depende de fechas y etapa procesal. Cuénteme qué ocurrió y cuándo, y le orientaré.",
        "Si tiene un plazo próximo, descríbame el caso y estimaré qué tan prioritario es actuar.",
      ],
      seed
    ),
    quickReplies: ["Analizar mi caso"],
    diagnostic: null,
  };
}

function documentsMessage(context: ChatContext, seed: string): ChatReply {
  if (context.lastDiagnostic) {
    const r = context.lastDiagnostic;
    const docs = r.documents.map((d) => `• ${d}`).join("\n");
    return {
      content: [
        pickVariant(
          [
            `Para su caso (${r.categoryLabel}), lo más importante es reunir:`,
            `Según lo analizado (${r.categoryLabel}), le sugiero priorizar:`,
            `En ${r.categoryLabel}, estos son los documentos clave:`,
          ],
          seed
        ),
        "",
        r.documentationRequest,
        "",
        docs,
        "",
        "Cuanto más completa esté la carpeta, más precisa será la revisión profesional.",
      ].join("\n"),
      quickReplies: ["Contactar abogado", "Analizar otro caso"],
      diagnostic: null,
    };
  }

  return {
    content: pickVariant(
      [
        "La documentación varía según la materia. Si me cuenta su situación —licitación, sumario, despido, municipal, etc.— le indico exactamente qué reunir.",
        "Depende del tipo de conflicto. Describa brevemente qué ocurrió y le entregaré una lista concreta de documentos.",
        "Cada materia exige antecedentes distintos. Cuénteme su caso y le diré qué documentos son prioritarios.",
      ],
      seed
    ),
    quickReplies: ["Analizar mi caso", "Ver especialidades"],
    diagnostic: null,
  };
}

function navigationMessage(text: string, seed: string): ChatReply {
  if (matches(text, ["diagnostico", "ia legal", "analizar"])) {
    return {
      content: pickVariant(
        [
          "Puede usar el diagnóstico completo en la sección «Diagnóstico legal», o contármelo aquí y le orientaré al instante.",
          "Tiene dos opciones: la sección de diagnóstico en el sitio, o conversar conmigo directamente.",
        ],
        seed
      ),
      quickReplies: ["Analizar mi caso", "Ir a diagnóstico"],
      diagnostic: null,
    };
  }

  if (matches(text, ["metodologia"])) {
    return {
      content:
        "En Metodología explicamos cómo trabajamos: evaluación inicial, estrategia, ejecución y seguimiento. ¿Quiere orientación sobre un caso concreto?",
      quickReplies: ["Analizar mi caso", "Contactar abogado"],
      diagnostic: null,
    };
  }

  if (matches(text, ["faq", "preguntas"])) {
    return {
      content:
        "En Preguntas frecuentes hay respuestas sobre cobertura nacional, licitaciones, sumarios y más. También puedo resolver consultas puntuales aquí mismo.",
      quickReplies: ["Analizar mi caso", "Contactar abogado"],
      diagnostic: null,
    };
  }

  return {
    content:
      "Secciones del sitio:\n\n• Diagnóstico legal\n• Especialidades\n• Metodología\n• Contacto\n\n¿Qué necesita?",
    quickReplies: ["Analizar mi caso", "Ir a contacto", "Ver especialidades"],
    diagnostic: null,
  };
}

function analyzeCase(text: string): ChatReply {
  const diagnostic = diagnoseLegalCase(text);
  persistDiagnostic(diagnostic, text);

  return {
    content: formatDiagnostic(diagnostic, text),
    quickReplies: [
      "Contactar abogado",
      "¿Qué documentos necesito?",
      "Analizar otro caso",
    ],
    diagnostic,
  };
}

function handleQuickAction(
  text: string,
  context: ChatContext,
  seed: string
): ChatReply | null {
  const n = normalize(text);

  if (n === "analizar mi caso" || n === "analizar otro caso") {
    const prompts = [
      "Perfecto. Cuénteme con detalle: qué ocurrió, con qué organismo o empresa está involucrado, fechas relevantes y si hay algún plazo próximo.",
      "De acuerdo. Describa su situación lo más completa posible: hechos, actores, documentos que tenga y cualquier fecha límite.",
      "Muy bien. Relámeme su caso: qué pasó, quién interviene y si recibió alguna notificación o resolución.",
    ];
    return {
      content: pickVariant(prompts, seed),
      quickReplies: [],
      diagnostic: null,
    };
  }

  if (n === "ver especialidades") return specialtiesMessage(seed);
  if (n === "contactar abogado" || n === "ir a contacto") {
    return {
      content:
        "Le dirijo al formulario de contacto. Si ya analizó su caso aquí, el mensaje se completará automáticamente.\n\nTambién puede escribir a info@salfateabogados.cl o WhatsApp +56 9 9154 5512.",
      quickReplies: ["Analizar mi caso"],
      diagnostic: null,
      navigateTo: "contacto",
    };
  }

  if (n === "ir a diagnostico") {
    return {
      content:
        "Le llevo a la sección de diagnóstico legal del sitio. También puede seguir conversando aquí si prefiere.",
      quickReplies: ["Analizar mi caso"],
      diagnostic: null,
      navigateTo: "ia-legal",
    };
  }

  if (n === "que documentos necesito" || n === "¿qué documentos necesito?") {
    return documentsMessage(context, seed);
  }

  return null;
}

function fallbackMessage(context: ChatContext, seed: string): ChatReply {
  if (context.lastDiagnostic) {
    return {
      content: pickVariant(
        [
          "¿Desea profundizar en su caso anterior, saber qué documentos reunir o contactar al estudio?",
          "Puedo ampliar la orientación sobre su caso, indicar documentos o conectarle con contacto.",
          "Si lo prefiere, retomamos su caso previo o abordamos otra consulta.",
        ],
        seed
      ),
      quickReplies: [
        "¿Qué documentos necesito?",
        "Contactar abogado",
        "Analizar otro caso",
      ],
      diagnostic: null,
    };
  }

  return {
    content: pickVariant(
      [
        "Para orientarle mejor, cuénteme qué ocurrió, con quién está el conflicto (municipalidad, empleador, organismo público…) y si hay plazos urgentes.",
        "Necesito un poco más de contexto. ¿Podría describir su situación con más detalle?",
        "Si me explica brevemente su caso, podré clasificarlo y decirle qué documentos conviene reunir.",
        "Puedo ayudarle con su caso, especialidades, documentos o contacto. ¿Qué le interesa?",
      ],
      seed
    ),
    quickReplies: [
      "Analizar mi caso",
      "Ver especialidades",
      "Contactar abogado",
    ],
    diagnostic: null,
  };
}

export function processChatMessage(
  input: string,
  context: ChatContext
): ChatReply {
  const text = input.trim();
  const seed = text + String(context.messageCount);

  if (!text) {
    return {
      content: "Escriba su consulta o elija una opción sugerida.",
      quickReplies: welcomeMessage(seed).quickReplies,
      diagnostic: null,
    };
  }

  const quick = handleQuickAction(text, context, seed);
  if (quick) return quick;

  if (isGreeting(text)) return welcomeMessage(seed);
  if (isHelpRequest(text)) return helpMessage(seed);
  if (isAboutRequest(text)) return aboutMessage(seed);
  if (isPricingRequest(text)) return pricingMessage(seed);
  if (isUrgencyQuestion(text)) return urgencyMessage(context, seed);
  if (isContactRequest(text)) return contactMessage(seed);
  if (isSpecialtiesRequest(text)) return specialtiesMessage(seed);
  if (isDocumentsRequest(text)) return documentsMessage(context, seed);
  if (isNavigationRequest(text)) return navigationMessage(text, seed);

  if (isThanks(text)) {
    return {
      content: pickVariant(
        [
          "De nada. Estoy aquí si necesita ampliar la orientación o contactar al estudio.",
          "Con gusto. Si surge otra duda sobre su caso, escríbame.",
          "Me alegra haber ayudado. Puede volver cuando lo necesite.",
        ],
        seed
      ),
      quickReplies: ["Analizar mi caso", "Contactar abogado"],
      diagnostic: null,
    };
  }

  if (isFarewell(text)) {
    return {
      content: pickVariant(
        [
          "Hasta pronto. Recuerde que puede volver cuando necesite orientación legal.",
          "Que le vaya bien. Aquí estaré si requiere más ayuda.",
          "Nos leemos. No dude en escribir si tiene otra consulta.",
        ],
        seed
      ),
      quickReplies: [],
      diagnostic: null,
    };
  }

  if (isAffirmative(text) && context.lastDiagnostic) {
    return documentsMessage(context, seed);
  }

  if (isAffirmative(text)) {
    return {
      content: pickVariant(
        [
          "Perfecto. ¿Quiere contarme su caso, ver especialidades o ir al contacto?",
          "Muy bien. ¿Por dónde seguimos?",
        ],
        seed
      ),
      quickReplies: [
        "Analizar mi caso",
        "Ver especialidades",
        "Contactar abogado",
      ],
      diagnostic: null,
    };
  }

  if (isLegalCase(text)) return analyzeCase(text);
  if (text.length >= 20) return analyzeCase(text);

  return fallbackMessage(context, seed);
}

export function createWelcomeChatMessage(): ChatMessage {
  const reply = welcomeMessage("init");
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

export function getProactiveTeaser(pageSeconds: number): string {
  const index = Math.floor(pageSeconds / 8) % TEASER_MESSAGES.length;
  return TEASER_MESSAGES[index];
}
