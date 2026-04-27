export type UrgencyLevel = "Bajo" | "Medio" | "Alto";

export type LegalCategoryId =
  | "compras_publicas"
  | "sumario"
  | "municipal"
  | "reclamacion_admin"
  | "laboral"
  | "general"
  | "inicial";

export interface LegalDiagnosticResult {
  categoryId: LegalCategoryId;
  categoryLabel: string;
  urgency: UrgencyLevel;
  actions: string[];
  documents: string[];
  recommendation: string;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function matchesAny(text: string, keywords: string[]): boolean {
  const n = normalize(text);
  return keywords.some((k) => n.includes(normalize(k)));
}

/** Clasificación local por palabras clave. Sustituible en segunda etapa por respuesta de API. */
export function diagnoseLegalCase(input: string): LegalDiagnosticResult {
  const text = input.trim();
  if (!text) {
    return buildInicial("Medio");
  }

  const highUrgency =
    matchesAny(text, [
      "plazo",
      "vencimiento",
      "hoy",
      "urgente",
      "notificación",
      "citación",
      "despido",
      "sumario",
      "sanción",
    ]) || text.length > 400;

  if (
    matchesAny(text, [
      "licitación",
      "licitacion",
      "mercado público",
      "mercado publico",
      "compra pública",
      "compra publica",
      "adjudicación",
      "adjudicacion",
      "bases",
      "oferta",
      "chilecompra",
      "tribunal de compras",
      "impugnación de licitación",
      "impugnacion de licitacion",
    ])
  ) {
    return {
      categoryId: "compras_publicas",
      categoryLabel: "Compras Públicas / Licitaciones",
      urgency: highUrgency ? "Alto" : "Medio",
      actions: [
        "Revisar bases administrativas, pliegos y actas frente a la normativa aplicable.",
        "Evaluar recurso ante el Tribunal de Compras Públicas u otras vías según etapa del procedimiento.",
        "Analizar documentación de la oferta y comunicaciones del órgano contratante.",
      ],
      documents: [
        "Bases o pliego de licitación",
        "Oferta presentada y anexos",
        "Actas o resoluciones de adjudicación o desiertas",
        "Correo u oficios del organismo",
      ],
      recommendation:
        "La estrategia depende del estado del procedimiento y de los plazos legales. Conviene ordenar la carpeta y revisar formalidad de actuaciones antes de impugnar o reclamar.",
    };
  }

  if (
    matchesAny(text, [
      "sumario",
      "funcionario",
      "investigación administrativa",
      "investigacion administrativa",
      "sanción disciplinaria",
      "sancion disciplinaria",
      "destitución",
      "destitucion",
      "procedimiento disciplinario",
    ])
  ) {
    return {
      categoryId: "sumario",
      categoryLabel: "Sumario Administrativo",
      urgency: "Alto",
      actions: [
        "Revisar notificación de inicio, cargos y plazos para presentar descargos o recursos.",
        "Preparar estrategia probatoria y lineamiento de defensa ante el órgano competente.",
        "Evaluar eventuales recursos posteriores según resultado.",
      ],
      documents: [
        "Resolución o decreto de inicio de sumario",
        "Cargos y antecedentes citados",
        "Descargos o declaraciones ya presentadas",
        "Reglamento interno o estatuto aplicable",
      ],
      recommendation:
        "Los sumarios suelen tener plazos estrictos. Es recomendable actuar con rapidez y con defensa técnica alineada al mérito del expediente.",
    };
  }

  if (
    matchesAny(text, [
      "municipalidad",
      "municipio",
      "patente",
      "dom",
      "fiscalización municipal",
      "fiscalizacion municipal",
      "permiso de edificación",
      "alcoholes",
      "comercio ambulante",
    ])
  ) {
    return {
      categoryId: "municipal",
      categoryLabel: "Derecho Administrativo Municipal",
      urgency: highUrgency ? "Medio" : "Bajo",
      actions: [
        "Identificar el acto administrativo impugnable y el silencio o denegación según corresponda.",
        "Revisar ordenanzas, resoluciones de patentes o procedimientos de fiscalización.",
        "Evaluar reclamo ante el alcalde, recursos en sede administrativa o judicial según el caso.",
      ],
      documents: [
        "Resoluciones de patente o fiscalización",
        "Informes de inspectores municipales",
        "Solicitudes de permisos o rectificaciones",
        "Correspondencia con la municipalidad",
      ],
      recommendation:
        "La vía depende del tipo de acto y del órgano emisor. Una revisión ordenada de la carpeta municipal suele definir el siguiente paso procesal.",
    };
  }

  if (
    matchesAny(text, [
      "contraloría",
      "contraloria",
      "toma de razón",
      "toma de razon",
      "superintendencia",
      "reclamo administrativo",
      "transparencia",
      "lobby",
      "ley de lobby",
    ])
  ) {
    return {
      categoryId: "reclamacion_admin",
      categoryLabel: "Reclamación Administrativa",
      urgency: highUrgency ? "Alto" : "Medio",
      actions: [
        "Delimitar el acto o omisión reclamable y el órgano competente para conocer el reclamo.",
        "Revisar requisitos formales y plazos del procedimiento administrativo correspondiente.",
        "Planificar eventual impugnación judicial complementaria si aplica.",
      ],
      documents: [
        "Acto administrativo o informe de Contraloría",
        "Antecedentes de trámite en el servicio",
        "Correspondencia con superintendencia u órgano fiscalizador",
        "Estatutos o resoluciones internas relevantes",
      ],
      recommendation:
        "Estas materias combinan técnica sustantiva y cumplimiento de plazos. La revisión temprana reduce riesgos de caducidad o improcedencia.",
    };
  }

  if (
    matchesAny(text, [
      "despido",
      "tutela laboral",
      "trabajador",
      "empleador",
      "finiquito",
      "mutuo acuerdo",
      "despido injustificado",
      "carta de aviso",
    ])
  ) {
    return {
      categoryId: "laboral",
      categoryLabel: "Derecho Laboral",
      urgency: highUrgency ? "Alto" : "Medio",
      actions: [
        "Revisar contrato, modificaciones y antecedentes de la relación laboral.",
        "Analizar procedimiento de despido o negociación de salida y plazos para reclamo.",
        "Evaluar mediación, negociación o demanda según objetivos del cliente.",
      ],
      documents: [
        "Contrato de trabajo y anexos",
        "Cartas de despido o avisos",
        "Liquidaciones y finiquitos",
        "Correo o comunicaciones con la empresa",
      ],
      recommendation:
        "Los plazos para interponer tutela u otras acciones son relevantes. Conviene reunir la documentación laboral antes de definir la estrategia.",
    };
  }

  if (
    matchesAny(text, [
      "familia",
      "penal",
      "civil",
      "tránsito",
      "transito",
      "consumidor",
      "divorcio",
      "custodia",
      "alimentos",
    ])
  ) {
    return {
      categoryId: "general",
      categoryLabel: "Área Legal General",
      urgency: highUrgency ? "Medio" : "Bajo",
      actions: [
        "Clarificar hechos, partes involucradas y etapa actual del conflicto o investigación.",
        "Identificar la jurisdicción competente y posibles acuerdos o litigios.",
        "Definir prioridades del cliente y calendario procesal estimado.",
      ],
      documents: [
        "Escritos o citaciones recibidas",
        "Contratos o correspondencia relevante",
        "Partes policiales o informes",
        "Antecedentes médicos o periciales si aplica",
      ],
      recommendation:
        "Cada subárea tiene reglas y plazos propios. Una primera reunión permite orientar la vía más adecuada sin anticipar resultado.",
    };
  }

  return buildInicial(highUrgency ? "Medio" : "Bajo");
}

function buildInicial(urgency: UrgencyLevel): LegalDiagnosticResult {
  return {
    categoryId: "inicial",
    categoryLabel: "Evaluación Legal Inicial",
    urgency,
    actions: [
      "Agendar entrevista para precisar hechos, partes y documentación disponible.",
      "Delimitar objetivos del cliente y posibles riesgos u oportunidades procesales.",
      "Proponer plan de trabajo y próximos hitos.",
    ],
    documents: [
      "Cualquier resolución o carta recibida de un organismo público",
      "Cronología breve de los hechos",
      "Correo o mensajes relevantes",
      "Contratos o convenios vinculados al conflicto",
    ],
    recommendation:
      "Sin antecedentes suficientes en el texto, la categoría queda en evaluación inicial. Un abogado podrá orientar con precisión al revisar los documentos.",
  };
}
