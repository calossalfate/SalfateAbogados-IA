export type ThemePreset = "classic" | "corporate-blue" | "conservative";

export type PracticeAreaContent = {
  icon: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteContent = {
  siteName: string;
  contact: {
    email: string;
    phone: string;
    phoneDisplay: string;
    whatsappNumber: string;
    coverage: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  theme: ThemePreset;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    panelTitle: string;
    panelStatus: string;
    panelDisclaimer: string;
    indicators: string[];
  };
  practiceAreas: {
    eyebrow: string;
    title: string;
    subtitle: string;
    subtitle2: string;
    cta: string;
    areas: PracticeAreaContent[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  contactSection: {
    title: string;
    description: string;
    caseTypes: string[];
    successMessage: string;
    errorMessage: string;
  };
  strongCta: {
    title: string;
    subtitle: string;
  };
  chat: {
    assistantName: string;
    subtitle: string;
    teaserMessages: string[];
    welcomeQuickReplies: string[];
  };
  footer: {
    tagline: string;
    disclaimer: string;
  };
};

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  caseType: string;
  message: string;
  /** Campo trampa anti-bots; debe ir vacío. */
  website?: string;
};
