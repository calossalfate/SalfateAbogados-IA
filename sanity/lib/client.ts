import { createClient, type SanityClient } from "next-sanity";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-06-14";

export const isSanityConfigured = Boolean(sanityProjectId);

export function getSanityClient(): SanityClient | null {
  if (!sanityProjectId) return null;
  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: process.env.NODE_ENV === "production",
  });
}

export const SITE_CONTENT_QUERY = `*[_type == "siteContent" && _id == "siteContent"][0]{
  siteName,
  contact,
  seo,
  theme,
  hero,
  practiceAreas,
  faq,
  contactSection,
  strongCta,
  chat,
  footer
}`;
