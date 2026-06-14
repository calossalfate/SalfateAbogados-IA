import Link from "next/link";
import { mailtoUrl, whatsappUrl } from "@/lib/content/defaults";
import type { SiteContent } from "@/lib/content/types";
import { BrandLogo } from "@/components/BrandLogo";
import { StudioCredit } from "@/components/StudioCredit";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#ia-legal", label: "Diagnóstico legal" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

type FooterProps = {
  siteName: string;
  footer: SiteContent["footer"];
  contact: SiteContent["contact"];
};

export function Footer({ siteName, footer, contact }: FooterProps) {
  const wa = whatsappUrl(contact.whatsappNumber);
  const mail = mailtoUrl(contact.email);

  return (
    <footer className="border-t border-white/10 py-14 bg-petrol-300/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
          <div>
            <div className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/25 ring-1 ring-black/5">
              <BrandLogo variant="full" />
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted leading-relaxed">
              {footer.tagline}
            </p>
          </div>
          <div className="text-sm text-muted space-y-2">
            <p>
              <a href={mail} className="hover:text-accent-soft transition">
                {contact.email}
              </a>
            </p>
            <p>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-soft transition"
              >
                {contact.phoneDisplay}
              </a>
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted hover:text-accent-soft transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <StudioCredit />

        <p className="mt-8 text-center text-xs text-muted/90">
          © {new Date().getFullYear()} {siteName}. {footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
