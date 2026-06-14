import { cache } from "react";
import { defaultSiteContent } from "./defaults";
import { mergeSiteContent } from "./merge";
import type { SiteContent } from "./types";
import {
  getSanityClient,
  isSanityConfigured,
  SITE_CONTENT_QUERY,
} from "../../../sanity/lib/client";

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!isSanityConfigured) return defaultSiteContent;

  const client = getSanityClient();
  if (!client) return defaultSiteContent;

  try {
    const remote = await client.fetch<Partial<SiteContent> | null>(
      SITE_CONTENT_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    return mergeSiteContent(defaultSiteContent, remote);
  } catch {
    return defaultSiteContent;
  }
});

export { defaultSiteContent };
