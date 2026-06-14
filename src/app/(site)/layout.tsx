import type { Metadata } from "next";
import { FloatingLegalChat } from "@/components/FloatingLegalChat";
import { ThemeInjector } from "@/components/ThemeInjector";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { getSiteContent } from "@/lib/content/getSiteContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    icons: {
      icon: [{ url: "/logo-mark.png", type: "image/png" }],
      apple: [{ url: "/logo-mark.png", type: "image/png" }],
    },
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <SiteContentProvider content={content}>
      <ThemeInjector />
      {children}
      <FloatingLegalChat />
    </SiteContentProvider>
  );
}
