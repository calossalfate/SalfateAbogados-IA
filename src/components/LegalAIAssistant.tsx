"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
  Brain,
  Loader2,
  Sparkles,
  FileStack,
  ListChecks,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  diagnoseLegalCase,
  type LegalDiagnosticResult,
} from "@/lib/legalAIDiagnostic";

const ANALYSIS_MS = 1400;

function urgencyStyles(u: string) {
  if (u === "Alto")
    return "bg-red-500/15 text-red-300 border-red-500/30";
  if (u === "Medio")
    return "bg-amber-500/15 text-amber-200 border-amber-500/30";
  return "bg-emerald-500/12 text-emerald-200 border-emerald-500/25";
}

export function LegalAIAssistant() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LegalDiagnosticResult | null>(null);

  const analyze = useCallback(() => {
    setResult(null);
    setLoading(true);
    window.setTimeout(() => {
      setResult(diagnoseLegalCase(text));
      setLoading(false);
    }, ANALYSIS_MS);
  }, [text]);

  return (
    <section
      id="ia-legal"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -right-[20%] top-0 h-full w-[90%] sm:w-[75%] lg:right-0 lg:w-[55%]">
          <Image
            src="/ia.jfif"
            alt=""
            fill
            quality={75}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-left opacity-[0.18] blur-[1.5px] sm:opacity-[0.28] sm:blur-[1px] lg:opacity-[0.32]"
            loading="lazy"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/97 to-graphite/80 lg:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-graphite/90 lg:bg-gradient-to-r lg:from-graphite lg:via-graphite/85 lg:to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              IA Legal · POC
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Diagnóstico orientativo asistido
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Herramienta de demostración que clasifica su relato por palabras
              clave. En una siguiente etapa se conectará a motor de IA y
              backend seguro.
            </p>
          </div>
          <div className="flex max-w-xl items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90 backdrop-blur-md">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
            <span>
              Este diagnóstico es preliminar y{" "}
              <strong className="font-semibold text-amber-50">
                no reemplaza la asesoría profesional de un abogado
              </strong>
              .
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="glass-strong relative rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/20">
            <label
              htmlFor="legal-case"
              className="flex items-center gap-2 text-sm font-medium text-ink"
            >
              <Brain className="h-4 w-4 text-accent" />
              Describa su situación (texto libre)
            </label>
            <textarea
              id="legal-case"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ejemplo: participé en una licitación pública y mi oferta fue rechazada injustamente…"
              className="mt-3 min-h-[160px] w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ink placeholder:text-muted/70 backdrop-blur-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={analyze}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-petrol-300 transition hover:bg-accent-soft disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analizando…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analizar caso
                  </>
                )}
              </button>
              <p className="text-xs text-muted">
                Sin envío a servidores externos en esta versión.
              </p>
            </div>

            {loading && (
              <div
                className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-6"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-3 text-accent-soft">
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                  <div>
                    <p className="text-sm font-medium">Analizando…</p>
                    <p className="mt-1 text-xs text-muted">
                      Clasificación local por palabras clave (simulación).
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 h-1 overflow-hidden rounded-full bg-white/10"
                  aria-hidden
                >
                  <div className="h-full w-full origin-left animate-[shimmer_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-accent/60 to-transparent bg-[length:200%_100%]" />
                </div>
              </div>
            )}

            {!loading && result && (
              <div className="mt-8 space-y-6 animate-fade-in">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-ink">
                    Categoría: {result.categoryLabel}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${urgencyStyles(
                      result.urgency
                    )}`}
                  >
                    Urgencia: {result.urgency}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/25 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-soft">
                    <ListChecks className="h-4 w-4" />
                    Posibles vías de acción
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                    {result.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/25 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-soft">
                    <FileStack className="h-4 w-4" />
                    Documentos recomendados
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                    {result.documents.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
                  <h3 className="text-sm font-semibold text-ink">
                    Recomendación final
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {result.recommendation}
                  </p>
                  <Link
                    href="#contacto"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-accent/40 bg-transparent py-3 text-sm font-semibold text-accent transition hover:bg-accent/10 sm:w-auto sm:px-8"
                  >
                    Solicitar revisión profesional
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="relative z-10 space-y-4">
            <div className="glass rounded-2xl p-6 backdrop-blur-md">
              <h3 className="font-display text-lg font-semibold text-ink">
                Arquitectura preparada
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="text-accent">·</span>
                  Endpoint de API de IA (pendiente)
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">·</span>
                  Orquestación vía n8n / webhooks
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">·</span>
                  CRM, correo y almacenamiento de documentos
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">·</span>
                  Panel de clientes
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-sm text-muted backdrop-blur-sm">
              La función{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-accent-soft">
                diagnoseLegalCase
              </code>{" "}
              en <code className="text-xs">src/lib/legalAIDiagnostic.ts</code>{" "}
              puede sustituirse por una llamada a su API sin cambiar la UI.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
