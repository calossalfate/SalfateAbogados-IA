"use client";

import { useState, FormEvent } from "react";
import { Mail, MessageCircle, MapPin, Send, CheckCircle2 } from "lucide-react";

const WA = "https://wa.me/56991545512";
const MAIL = "mailto:info@salfateabogados.cl";

const caseTypes = [
  "Compras públicas / licitaciones",
  "Sumario administrativo",
  "Municipal / patentes / fiscalización",
  "Contraloría / transparencia / lobby",
  "Laboral",
  "Civil / penal / familia / consumidor",
  "Propiedades / derechos de agua / títulos",
  "Otro / a definir",
];

export function ContactSection() {
  const [toast, setToast] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setToast(true);
    window.setTimeout(() => setToast(false), 5000);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section
      id="contacto"
      className="relative py-24 sm:py-28 scroll-mt-24 border-t border-white/[0.06] bg-petrol-200/25"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Contacto
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Cuéntenos brevemente su caso. En esta versión el formulario
              registra la solicitud de forma simulada; más adelante se
              conectará a correo, CRM o automatización.
            </p>

            <ul className="mt-10 space-y-5 text-sm">
              <li>
                <a
                  href={MAIL}
                  className="group flex items-start gap-3 text-ink hover:text-accent-soft"
                >
                  <Mail className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                  <span>
                    <span className="block text-muted text-xs uppercase tracking-wider">
                      Correo
                    </span>
                    info@salfateabogados.cl
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-ink hover:text-accent-soft"
                >
                  <MessageCircle className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                  <span>
                    <span className="block text-muted text-xs uppercase tracking-wider">
                      Teléfono / WhatsApp
                    </span>
                    +56 9 9154 5512
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted">
                <MapPin className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted">
                    Cobertura
                  </span>
                  Atención en todo Chile
                </span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="glass-strong rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-muted">Nombre</span>
                  <input
                    required
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-muted">Email</span>
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="text-muted">Teléfono</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted">Tipo de caso</span>
                <select
                  required
                  name="caseType"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccione…
                  </option>
                  {caseTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted">Mensaje</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-petrol-300 transition hover:bg-accent-soft sm:w-auto sm:px-10"
              >
                <Send className="h-4 w-4" />
                Enviar
              </button>
            </form>

            {toast && (
              <div
                className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/90 px-4 py-3 text-sm text-emerald-100 shadow-lg animate-fade-in"
                role="status"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>
                  Solicitud registrada. En la siguiente etapa conectaremos este
                  formulario a correo/CRM.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
