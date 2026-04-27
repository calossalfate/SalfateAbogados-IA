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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AuthorityBlock />
        <PracticeAreas />
        <LegalAIAssistant />
        <Methodology />
        <AudienceSection />
        <StrongCTA />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
