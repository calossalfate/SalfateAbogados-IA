import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AuthorityBlock } from "@/components/AuthorityBlock";
import { PracticeAreas } from "@/components/PracticeAreas";
import { LegalAIAssistant } from "@/components/LegalAIAssistant";
import { Methodology } from "@/components/Methodology";
import { AudienceSection } from "@/components/AudienceSection";
import { StrongCTA } from "@/components/StrongCTA";
import { FAQ } from "@/components/FAQ";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { getSiteContent } from "@/lib/content/getSiteContent";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Header />
      <main>
        <Hero hero={content.hero} />
        <AuthorityBlock />
        <PracticeAreas practiceAreas={content.practiceAreas} />
        <LegalAIAssistant />
        <Methodology />
        <AudienceSection />
        <StrongCTA strongCta={content.strongCta} contact={content.contact} />
        <FAQ faq={content.faq} />
        <ContactSection contactSection={content.contactSection} />
      </main>
      <Footer
        siteName={content.siteName}
        footer={content.footer}
        contact={content.contact}
      />
    </>
  );
}
