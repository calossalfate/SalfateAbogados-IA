import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Sparkles } from "lucide-react";
import { mailtoUrl, whatsappUrl } from "@/lib/content/defaults";
import type { SiteContent } from "@/lib/content/types";

type StrongCTAProps = {
  strongCta: SiteContent["strongCta"];
  contact: SiteContent["contact"];
};

export function StrongCTA({ strongCta, contact }: StrongCTAProps) {
  const wa = whatsappUrl(contact.whatsappNumber);
  const mail = mailtoUrl(contact.email);

  return (
    <section className="relative min-h-[420px] overflow-hidden py-20 sm:min-h-[460px] sm:py-28">
      <div className="absolute inset-0 z-0">
        <Image
          src="/ctafinal.jpg"
          alt=""
          fill
          quality={80}
          sizes="100vw"
          className="object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-black/70" aria-hidden />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/40"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex min-h-[380px] max-w-6xl flex-col items-center justify-center px-4 text-center sm:min-h-[420px] sm:px-6 lg:px-8">
        <h2 className="font-display max-w-3xl text-2xl font-semibold leading-tight text-ink drop-shadow-md sm:text-3xl lg:text-[2rem] text-balance">
          {strongCta.title}
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/85 sm:text-base">
          {strongCta.subtitle}
        </p>
        <div className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={mail}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/35 bg-white/10 px-8 py-3.5 text-sm font-semibold text-ink backdrop-blur-sm transition hover:border-accent/60 hover:bg-white/15"
          >
            <Mail className="h-4 w-4" />
            Enviar correo
          </a>
          <Link
            href="#ia-legal"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-petrol-300 shadow-lg shadow-black/25 transition hover:bg-accent-soft"
          >
            <Sparkles className="h-4 w-4" />
            Diagnóstico legal
          </Link>
        </div>
      </div>
    </section>
  );
}
