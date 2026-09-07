import type { SiteContent } from "./types";
import editableJson from "@/data/editable-content.json";

/** Campos que el panel sencillo puede editar. */
export type EditableContent = {
  siteName: string;
  contact: SiteContent["contact"];
  hero: Pick<
    SiteContent["hero"],
    "badge" | "title" | "subtitle" | "ctaPrimary" | "ctaSecondary"
  >;
  contactSection: Pick<
    SiteContent["contactSection"],
    "title" | "description"
  >;
  strongCta: SiteContent["strongCta"];
  footer: SiteContent["footer"];
};

export const editableContentFilePath = "src/data/editable-content.json";

export function getEditableFromModule(): EditableContent {
  return editableJson as EditableContent;
}

export function editableToPartial(
  editable: EditableContent
): Partial<SiteContent> {
  return {
    siteName: editable.siteName,
    contact: editable.contact,
    hero: editable.hero as SiteContent["hero"],
    contactSection: editable.contactSection as SiteContent["contactSection"],
    strongCta: editable.strongCta,
    footer: editable.footer,
  };
}

export function sanitizeEditable(input: unknown): EditableContent | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const contact = asObject(raw.contact);
  const hero = asObject(raw.hero);
  const contactSection = asObject(raw.contactSection);
  const strongCta = asObject(raw.strongCta);
  const footer = asObject(raw.footer);

  if (!contact || !hero || !contactSection || !strongCta || !footer) {
    return null;
  }

  const email = str(contact.email);
  const phone = str(contact.phone);
  const phoneDisplay = str(contact.phoneDisplay);
  const whatsappNumber = str(contact.whatsappNumber).replace(/\D/g, "");
  const coverage = str(contact.coverage);

  if (!email || !phoneDisplay || !whatsappNumber) return null;

  return {
    siteName: str(raw.siteName) || "Salfate Abogados",
    contact: {
      email,
      phone: phone || `+${whatsappNumber}`,
      phoneDisplay,
      whatsappNumber,
      coverage: coverage || "Atención en todo Chile",
    },
    hero: {
      badge: str(hero.badge),
      title: str(hero.title),
      subtitle: str(hero.subtitle),
      ctaPrimary: str(hero.ctaPrimary),
      ctaSecondary: str(hero.ctaSecondary),
    },
    contactSection: {
      title: str(contactSection.title),
      description: str(contactSection.description),
    },
    strongCta: {
      title: str(strongCta.title),
      subtitle: str(strongCta.subtitle),
    },
    footer: {
      tagline: str(footer.tagline),
      disclaimer: str(footer.disclaimer),
    },
  };
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
