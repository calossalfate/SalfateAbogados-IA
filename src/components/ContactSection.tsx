"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import {
  DIAGNOSTIC_STORAGE_KEY,
  categoryToContactCaseType,
  type LegalDiagnosticResult,
} from "@/lib/legalAIDiagnostic";
import { mailtoUrl, whatsappUrl } from "@/lib/content/defaults";
import type { SiteContent } from "@/lib/content/types";

type StoredDiagnostic = {
  result: LegalDiagnosticResult;
  userText: string;
};

function buildMessageFromDiagnostic(data: StoredDiagnostic): string {
  const { result, userText } = data;
  const docs = result.documents.map((d) => `• ${d}`).join("\n");
  return [
    "Solicito revisión profesional tras el diagnóstico orientativo.",
    "",
    `Categoría detectada: ${result.categoryLabel}`,
    `Urgencia: ${result.urgency}`,
    "",
    "Relato:",
    userText.trim(),
    "",
    "Documentación que tengo disponible o puedo reunir:",
    docs,
  ].join("\n");
}

type ContactSectionProps = {
  contactSection: SiteContent["contactSection"];
};

export function ContactSection({ contactSection }: ContactSectionProps) {
  const { contact } = useSiteContent();
  const [toast, setToast] = useState<"success" | "error" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [caseType, setCaseType] = useState("");
  const [message, setMessage] = useState("");

  const wa = whatsappUrl(contact.whatsappNumber);
  const mail = mailtoUrl(contact.email);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as StoredDiagnostic;
      if (!data?.result) return;
      setCaseType(categoryToContactCaseType[data.result.categoryId] ?? "");
      setMessage(buildMessageFromDiagnostic(data));
    } catch {
      /* datos no disponibles */
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          caseType,
          message,
          website: formData.get("website"),
        }),
      });

      if (!res.ok) {
        setToast("error");
        return;
      }

      setToast("success");
      form.reset();
      setCaseType("");
      setMessage("");
      window.setTimeout(() => setToast(null), 6000);
    } catch {
      setToast("error");
    } finally {
      setSubmitting(false);
    }
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
              {contactSection.title}
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              {contactSection.description}
            </p>

            <ul className="mt-10 space-y-5 text-sm">
              <li>
                <a
                  href={mail}
                  className="group flex items-start gap-3 text-ink hover:text-accent-soft"
                >
                  <Mail className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                  <span>
                    <span className="block text-muted text-xs uppercase tracking-wider">
                      Correo
                    </span>
                    {contact.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-ink hover:text-accent-soft"
                >
                  <MessageCircle className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                  <span>
                    <span className="block text-muted text-xs uppercase tracking-wider">
                      Teléfono / WhatsApp
                    </span>
                    {contact.phoneDisplay}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted">
                <MapPin className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted">
                    Cobertura
                  </span>
                  {contact.coverage}
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
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                >
                  <option value="" disabled>
                    Seleccione…
                  </option>
                  {contactSection.caseTypes.map((t) => (
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </label>

              {/* Campo trampa: oculto para usuarios, visible para bots */}
              <label
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                aria-hidden="true"
                tabIndex={-1}
              >
                <span>Sitio web</span>
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-petrol-300 transition hover:bg-accent-soft disabled:opacity-60 sm:w-auto sm:px-10"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Enviando…" : "Enviar"}
              </button>
            </form>

            {toast === "success" && (
              <div
                className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/90 px-4 py-3 text-sm text-emerald-100 shadow-lg animate-fade-in"
                role="status"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>{contactSection.successMessage}</span>
              </div>
            )}

            {toast === "error" && (
              <div
                className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/90 px-4 py-3 text-sm text-red-100 shadow-lg animate-fade-in"
                role="alert"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                <span>{contactSection.errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
