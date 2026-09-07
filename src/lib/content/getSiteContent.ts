import { cache } from "react";
import { defaultSiteContent } from "./defaults";
import {
  editableToPartial,
  getEditableFromModule,
} from "./editable";
import { mergeSiteContent } from "./merge";
import type { SiteContent } from "./types";
import {
  getSanityClient,
  isSanityConfigured,
  SITE_CONTENT_QUERY,
} from "../../../sanity/lib/client";

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  // 1) Defaults del código + overrides del panel sencillo (JSON del repo)
  const fromPanel = mergeSiteContent(
    defaultSiteContent,
    editableToPartial(getEditableFromModule())
  );

  // 2) Si Sanity está configurado, puede sobrescribir campos avanzados
  if (!isSanityConfigured) return fromPanel;

  const client = getSanityClient();
  if (!client) return fromPanel;

  try {
    const remote = await client.fetch<Partial<SiteContent> | null>(
      SITE_CONTENT_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    return mergeSiteContent(fromPanel, remote);
  } catch {
    return fromPanel;
  }
});

export { defaultSiteContent };
