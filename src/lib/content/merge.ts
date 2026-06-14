import type { SiteContent } from "@/lib/content/types";

/** Combina contenido de Sanity con defaults; Sanity solo sobreescribe lo definido. */
export function mergeSiteContent(
  defaults: SiteContent,
  remote: Partial<SiteContent> | null | undefined
): SiteContent {
  if (!remote) return defaults;

  return {
    siteName: remote.siteName || defaults.siteName,
    contact: { ...defaults.contact, ...stripNulls(remote.contact) },
    seo: {
      ...defaults.seo,
      ...stripNulls(remote.seo),
      keywords: remote.seo?.keywords?.length
        ? remote.seo.keywords
        : defaults.seo.keywords,
    },
    theme: remote.theme || defaults.theme,
    hero: {
      ...defaults.hero,
      ...stripNulls(remote.hero),
      indicators: remote.hero?.indicators?.length
        ? remote.hero.indicators
        : defaults.hero.indicators,
    },
    practiceAreas: {
      ...defaults.practiceAreas,
      ...stripNulls(remote.practiceAreas),
      areas: remote.practiceAreas?.areas?.length
        ? remote.practiceAreas.areas
        : defaults.practiceAreas.areas,
    },
    faq: {
      ...defaults.faq,
      ...stripNulls(remote.faq),
      items: remote.faq?.items?.length ? remote.faq.items : defaults.faq.items,
    },
    contactSection: {
      ...defaults.contactSection,
      ...stripNulls(remote.contactSection),
      caseTypes: remote.contactSection?.caseTypes?.length
        ? remote.contactSection.caseTypes
        : defaults.contactSection.caseTypes,
    },
    strongCta: { ...defaults.strongCta, ...stripNulls(remote.strongCta) },
    chat: {
      ...defaults.chat,
      ...stripNulls(remote.chat),
      teaserMessages: remote.chat?.teaserMessages?.length
        ? remote.chat.teaserMessages
        : defaults.chat.teaserMessages,
      welcomeQuickReplies: remote.chat?.welcomeQuickReplies?.length
        ? remote.chat.welcomeQuickReplies
        : defaults.chat.welcomeQuickReplies,
    },
    footer: { ...defaults.footer, ...stripNulls(remote.footer) },
  };
}

function stripNulls<T extends object>(obj: T | null | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== "")
  ) as Partial<T>;
}
