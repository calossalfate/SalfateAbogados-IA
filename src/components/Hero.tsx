import Image from "next/image";
import Link from "next/link";
import {
  Scale,
  Gavel,
  FileWarning,
  Landmark,
  MapPin,
  Sparkles,
} from "lucide-react";

const indicators = [
  { label: "Derecho Público", icon: Landmark },
  { label: "Compras Públicas", icon: Scale },
  { label: "Sumarios", icon: FileWarning },
  { label: "Litigación", icon: Gavel },
  { label: "Atención nacional", icon: MapPin },
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* Lectura izquierda: overlay moderado */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/35 to-transparent"
        aria-hidden
      />
      {/* Oscurece solo la derecha: evita que los claros de la imagen “rompan” el panel */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(270deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.42)_38%,rgba(0,0,0,0.12)_58%,transparent_78%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-petrol-300/40 via-transparent to-black/45"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[length:48px_48px] bg-grid-faint opacity-[0.1]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-radial-glow opacity-20"
        aria-hidden
      />

      <div className="relative z-20 mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8">
        <div className="animate-fade-in">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/45 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-amber-100/95 backdrop-blur-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Estudio jurídico · Chile
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-balance text-white sm:text-5xl lg:text-[2.75rem] xl:text-6xl [text-shadow:0_2px_16px_rgba(0,0,0,0.65),0_1px_3px_rgba(0,0,0,0.9)]">
            Defensa y asesoría legal estratégica frente al Estado
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-100 sm:text-lg [text-shadow:0_1px_10px_rgba(0,0,0,0.6),0_0_1px_rgba(0,0,0,0.8)]">
            Especialistas en Derecho Público, Derecho Administrativo, compras
            públicas, sumarios, litigación y asesoría integral para personas,
            empresas, funcionarios e instituciones en todo Chile.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#contacto"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-petrol-300 shadow-lg shadow-black/35 transition hover:bg-accent-soft"
            >
              Solicitar evaluación legal
            </Link>
            <Link
              href="#ia-legal"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white shadow-md shadow-black/25 backdrop-blur-sm transition hover:border-accent/60 hover:bg-white/15 hover:text-amber-50"
            >
              Probar diagnóstico IA
            </Link>
          </div>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-md animate-fade-in lg:mx-0 lg:justify-self-end">
          <div
            className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-br from-accent/20 to-transparent blur-2xl sm:-inset-3"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-black/45 p-6 shadow-2xl shadow-black/40 ring-1 ring-white/15 backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />
            <div className="relative">
              <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/20 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.65)] sm:text-xs sm:tracking-[0.22em]">
                  Panel operativo
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent [text-shadow:0_0_12px_rgba(201,169,98,0.45)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(201,169,98,0.95)]" />
                  </span>
                  En línea
                </span>
              </div>
              <ul className="space-y-3">
                {indicators.map(({ label, icon: Icon }) => (
                  <li
                    key={label}
                    className="flex items-center gap-4 rounded-xl border border-white/18 bg-black/40 px-4 py-3.5 shadow-inner shadow-black/30 backdrop-blur-sm"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/25 text-accent ring-2 ring-accent/40">
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold leading-snug tracking-wide text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]">
                        {label}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/15">
                        <div
                          className="h-full w-3/5 animate-pulse-soft rounded-full bg-gradient-to-r from-accent to-copper-light"
                          style={{
                            animationDelay: `${label.length % 5 * 0.2}s`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-xs leading-relaxed text-slate-200 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                Visualización orientativa de áreas de trabajo. No constituye
                asesoría legal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
