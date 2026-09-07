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

  return {
    ...base,
    theme,
    contact: {
      ...base.contact,
      email,
      phone: str(contact.phone) || `+${whatsappNumber}`,
      phoneDisplay,
      whatsappNumber,
      coverage: str(contact.coverage) || base.contact.coverage,
    },
    siteName: str(raw.siteName) || base.siteName,
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
