import Link from "next/link";
import { mailtoUrl, whatsappUrl } from "@/lib/content/defaults";
import type { SiteContent } from "@/lib/content/types";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#ia-legal", label: "Diagnóstico legal" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

const DESIGN_CREDIT = "https://buglabsoluciones.com";

type FooterProps = {
  siteName: string;
  footer: SiteContent["footer"];
  contact: SiteContent["contact"];
};

export function Footer({ siteName, footer, contact }: FooterProps) {
  const wa = whatsappUrl(contact.whatsappNumber);
  const mail = mailtoUrl(contact.email);
  const [first, ...rest] = siteName.split(" ");

  return (
    <footer className="border-t border-white/10 py-14 bg-petrol-300/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
          <div>
            <p className="font-display text-2xl font-semibold text-ink">
              {first}{" "}
              {rest.length > 0 ? (
                <span className="text-accent">{rest.join(" ")}</span>
              ) : null}
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed">
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
        <div className="mt-12 space-y-3 border-t border-white/5 pt-8 text-center text-xs text-muted">
          <p>
            © {new Date().getFullYear()} {siteName}. {footer.disclaimer}
          </p>
          <p>
            Diseño web completo:{" "}
            <a
              href={DESIGN_CREDIT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-center gap-x-1 underline-offset-2 hover:underline"
            >
              <span className="font-medium text-accent-soft/95 hover:text-accent">
                BugLab Soluciones
              </span>
              <span className="text-muted/90">· buglabsoluciones.com</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
