import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const STUDIO = {
  name: "BugLab Soluciones",
  url: "https://buglabsoluciones.com",
  tagline: "Desarrollo web, software e IA a medida",
} as const;

export function StudioCredit() {
  return (
    <aside
      className="mt-12 border-t border-white/10 pt-8"
      aria-label="Créditos de desarrollo"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-center text-xs leading-relaxed text-muted lg:max-w-md lg:text-left">
          Sitio profesional con formulario seguro, panel de edición y asistente
          legal orientativo. Infraestructura pensada para escalar con el estudio.
        </p>

        <Link
          href={STUDIO.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${STUDIO.name} — ${STUDIO.tagline}`}
          className="group mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-[#0a1628]/80 px-4 py-3.5 shadow-lg shadow-black/25 ring-1 ring-[#2b9cff]/10 transition duration-300 hover:border-[#2b9cff]/35 hover:ring-[#2b9cff]/25 lg:mx-0 lg:shrink-0"
        >
          <Image
            src="/buglab-logo.png"
            alt={STUDIO.name}
            width={251}
            height={236}
            sizes="120px"
            className="h-14 w-auto shrink-0 transition duration-300 group-hover:brightness-110 sm:h-16"
          />

          <span className="min-w-0 flex-1 text-left">
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted/90">
              Desarrollado por
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted transition group-hover:text-white/80">
              {STUDIO.tagline}
            </span>
            <span className="mt-1 block text-[11px] text-[#2b9cff]/80 transition group-hover:text-[#2b9cff]">
              buglabsoluciones.com
            </span>
          </span>

          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#2b9cff]"
            aria-hidden
          />
        </Link>
      </div>
    </aside>
  );
}
