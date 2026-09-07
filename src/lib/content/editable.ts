import type { SiteContent, ThemePreset } from "./types";
import { defaultSiteContent } from "./defaults";
import { mergeSiteContent } from "./merge";
import editableJson from "@/data/editable-content.json";

/** Contenido completo editable desde el panel + marca de tiempo. */
export type EditableContent = SiteContent & {
  updatedAt?: string;
};

export const editableContentFilePath = "src/data/editable-content.json";

export function getEditableFromModule(): EditableContent {
  const merged = mergeSiteContent(
    defaultSiteContent,
    editableJson as Partial<SiteContent>
  );
  const updatedAt =
    typeof (editableJson as { updatedAt?: unknown }).updatedAt === "string"
      ? (editableJson as { updatedAt: string }).updatedAt
      : undefined;
  return { ...merged, updatedAt };
}

export function editableToPartial(
  editable: EditableContent
): Partial<SiteContent> {
  return {
    siteName: editable.siteName,
    contact: editable.contact,
    seo: editable.seo,
    theme: editable.theme,
    hero: editable.hero,
    audience: editable.audience,
    practiceAreas: editable.practiceAreas,
    methodology: editable.methodology,
    faq: editable.faq,
    contactSection: editable.contactSection,
    strongCta: editable.strongCta,
    chat: editable.chat,
    footer: editable.footer,
  };
}

export function sanitizeEditable(input: unknown): EditableContent | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;

  const contact = asObject(raw.contact);
  if (!contact) return null;

  const email = str(contact.email);
  const phoneDisplay = str(contact.phoneDisplay);
  const whatsappNumber = str(contact.whatsappNumber).replace(/\D/g, "");
  if (!email || !phoneDisplay || !whatsappNumber) return null;

  const base = mergeSiteContent(defaultSiteContent, raw as Partial<SiteContent>);

  const theme = (["classic", "corporate-blue", "conservative"] as ThemePreset[])
    .includes(raw.theme as ThemePreset)
    ? (raw.theme as ThemePreset)
    : base.theme;

  // Límites anti-abuso: evita payloads enormes que reescriban el repo.
  base.practiceAreas.areas = base.practiceAreas.areas.slice(0, 40).map((a) => ({
    icon: clip(a.icon, 40),
    title: clip(a.title, 120),
    description: clip(a.description, 800),
  }));
  base.faq.items = base.faq.items.slice(0, 40).map((i) => ({
    question: clip(i.question, 200),
    answer: clip(i.answer, 2000),
  }));
  base.hero.indicators = base.hero.indicators.slice(0, 12).map((v) => clip(v, 60));
  base.seo.keywords = base.seo.keywords.slice(0, 30).map((v) => clip(v, 60));
  base.contactSection.caseTypes = base.contactSection.caseTypes
    .slice(0, 30)
    .map((v) => clip(v, 80));
  base.chat.teaserMessages = base.chat.teaserMessages
    .slice(0, 20)
    .map((v) => clip(v, 120));
  base.chat.welcomeQuickReplies = base.chat.welcomeQuickReplies
    .slice(0, 12)
    .map((v) => clip(v, 60));

  return {
    ...base,
    theme,
    contact: {
      ...base.contact,
      email: clip(email, 254),
      phone: clip(str(contact.phone) || `+${whatsappNumber}`, 30),
      phoneDisplay: clip(phoneDisplay, 40),
      whatsappNumber: clip(whatsappNumber, 20),
      coverage: clip(str(contact.coverage) || base.contact.coverage, 120),
    },
    siteName: clip(str(raw.siteName) || base.siteName, 80),
    hero: {
      ...base.hero,
      badge: clip(base.hero.badge, 80),
      title: clip(base.hero.title, 220),
      subtitle: clip(base.hero.subtitle, 800),
      ctaPrimary: clip(base.hero.ctaPrimary, 80),
      ctaSecondary: clip(base.hero.ctaSecondary, 80),
      panelTitle: clip(base.hero.panelTitle, 80),
      panelStatus: clip(base.hero.panelStatus, 40),
      panelDisclaimer: clip(base.hero.panelDisclaimer, 240),
    },
    updatedAt: new Date().toISOString(),
  };
}

export function computeContentMetrics(content: EditableContent) {
  const areas = content.practiceAreas.areas.length;
  const faqs = content.faq.items.length;
  const audience = content.audience.blocks.length;
  const steps = content.methodology.steps.length;

  const checks = [
    Boolean(content.contact.email),
    Boolean(content.contact.phoneDisplay),
    Boolean(content.contact.whatsappNumber),
    Boolean(content.hero.title),
    Boolean(content.hero.subtitle),
    areas > 0,
    faqs > 0,
    Boolean(content.seo.title),
    Boolean(content.footer.tagline),
  ];
  const completeness = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100
  );

  const textBlob = JSON.stringify(content);
  const words = textBlob.split(/\s+/).filter(Boolean).length;

  return {
    completeness,
    areas,
    faqs,
    audience,
    steps,
    words,
    updatedAt: content.updatedAt || null,
  };
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}
