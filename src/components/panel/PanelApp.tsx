"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { EditableContent } from "@/lib/content/editable";
import { defaultSiteContent } from "@/lib/content/defaults";
import {
  assistantStarters,
  replyToAssistantPrompt,
  type AssistantReply,
} from "@/lib/panel/assistant";

type SectionId =
  | "resumen"
  | "contacto"
  | "inicio"
  | "audiencia"
  | "especialidades"
  | "metodologia"
  | "faq"
  | "formulario"
  | "chat"
  | "seo"
  | "pie"
  | "asistente";

type Metrics = {
  completeness: number;
  areas: number;
  faqs: number;
  audience: number;
  steps: number;
  words: number;
  updatedAt: string | null;
};

type SpellMatch = {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: string[];
  snippet: string;
};

const NAV: { id: SectionId; label: string; hint: string }[] = [
  { id: "resumen", label: "Controlador", hint: "Métricas y estado" },
  { id: "contacto", label: "Contacto", hint: "Correo y teléfonos" },
  { id: "inicio", label: "Inicio", hint: "Hero principal" },
  { id: "audiencia", label: "Audiencia", hint: "Quiénes confían" },
  { id: "especialidades", label: "Especialidades", hint: "Áreas de práctica" },
  { id: "metodologia", label: "Metodología", hint: "Pasos del servicio" },
  { id: "faq", label: "FAQ", hint: "Preguntas frecuentes" },
  { id: "formulario", label: "Formulario", hint: "Textos de contacto" },
  { id: "chat", label: "Chat", hint: "Asistente Lex" },
  { id: "seo", label: "SEO", hint: "Google" },
  { id: "pie", label: "Pie y CTA", hint: "Cierre del sitio" },
  { id: "asistente", label: "Asistente IA", hint: "Ayuda y reportes" },
];

function emptyContent(): EditableContent {
  return { ...defaultSiteContent, updatedAt: undefined };
}

export function PanelApp() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState<EditableContent>(emptyContent);
  const [section, setSection] = useState<SectionId>("resumen");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [supportEmail, setSupportEmail] = useState(
    "carlos.salfate@chileatiende.cl"
  );
  const [showPreview, setShowPreview] = useState(true);
  const [spellMatches, setSpellMatches] = useState<SpellMatch[]>([]);
  const [spellInfo, setSpellInfo] = useState<string | null>(null);
  const [chat, setChat] = useState<AssistantReply[]>([
    {
      role: "assistant",
      text: "Hola. Soy tu copiloto del panel. Puedo guiarte para editar toda la web y avisar a Carlos si algo falla.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpReplyEmail, setHelpReplyEmail] = useState("");
  const [siteOnline, setSiteOnline] = useState<boolean | null>(null);

  const loadContent = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/panel/content", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error || "No se pudo cargar el contenido.");
      setAuthed(false);
      return;
    }
    const data = (await res.json()) as {
      content: EditableContent;
      metrics: Metrics;
      supportEmail?: string;
    };
    setContent(data.content);
    setMetrics(data.metrics);
    if (data.supportEmail) setSupportEmail(data.supportEmail);
    setAuthed(true);
  }, []);

  useEffect(() => {
    loadContent().finally(() => setChecking(false));
  }, [loadContent]);

  useEffect(() => {
    if (!authed) return;
    fetch("/", { method: "HEAD", cache: "no-store" })
      .then((r) => setSiteOnline(r.ok))
      .catch(() => setSiteOnline(false));
  }, [authed]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!res.ok) {
        setError(data?.error || "No se pudo iniciar sesión.");
        return;
      }
      setPassword("");
      await loadContent();
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/panel/logout", { method: "POST" });
    setAuthed(false);
    setContent(emptyContent());
    setMessage(null);
    setError(null);
  }

  async function handleSave(e?: FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/panel/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        content?: EditableContent;
        metrics?: Metrics;
      } | null;
      if (!res.ok) {
        setError(data?.error || "No se pudo guardar.");
        pushAssistant(
          `Hubo un problema al guardar: ${data?.error || "error desconocido"}. Puedes reportarlo a Carlos.`
        );
        return;
      }
      if (data?.content) setContent(data.content);
      if (data?.metrics) setMetrics(data.metrics);
      setMessage(data?.message || "Guardado correctamente.");
      pushAssistant(
        "Cambios guardados. La web se actualiza sola en 1–2 minutos. Usa Vista previa para revisar el tono antes de salir."
      );
    } finally {
      setBusy(false);
    }
  }

  function pushAssistant(text: string) {
    setChat((prev) => [...prev, { role: "assistant", text }]);
  }

  function askAssistant(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setChat((prev) => [
      ...prev,
      { role: "user", text: clean },
      { role: "assistant", text: replyToAssistantPrompt(clean) },
    ]);
    setChatInput("");
  }

  async function runSpellcheck() {
    setBusy(true);
    setSpellInfo(null);
    setSpellMatches([]);
    try {
      const text = spellcheckCorpus(content, section);
      const res = await fetch("/api/panel/spellcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        matches?: SpellMatch[];
      } | null;
      if (!res.ok) {
        setSpellInfo(data?.error || "No se pudo revisar.");
        return;
      }
      setSpellMatches(data?.matches || []);
      setSpellInfo(data?.message || null);
      pushAssistant(data?.message || "Revisión ortográfica lista.");
    } finally {
      setBusy(false);
    }
  }

  async function sendHelp(type: string) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/panel/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: helpMessage,
          page: section,
          replyEmail: helpReplyEmail,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
        fallbackMailto?: string;
        supportEmail?: string;
      } | null;
      if (!res.ok) {
        if (data?.fallbackMailto) {
          window.location.href = data.fallbackMailto;
        }
        setError(data?.error || "No se pudo enviar la ayuda.");
        return;
      }
      setMessage(data?.message || "Mensaje enviado a Carlos.");
      setHelpMessage("");
      pushAssistant(
        `Listo: avisé a Carlos (${data?.supportEmail || supportEmail}). Te contactará si necesita más detalle.`
      );
    } finally {
      setBusy(false);
    }
  }

  const lastUpdateLabel = useMemo(() => {
    if (!metrics?.updatedAt) return "Sin publicar desde el panel";
    try {
      return new Date(metrics.updatedAt).toLocaleString("es-CL");
    } catch {
      return metrics.updatedAt;
    }
  }, [metrics]);

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center text-slate-400">
        Cargando controlador…
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-slate-900 to-slate-950 p-7 shadow-2xl shadow-cyan-950/40">
          <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">
            Salfate Control Center
          </p>
          <h1 className="mt-2 font-serif text-3xl text-white">Panel del sitio</h1>
          <p className="mt-2 text-sm text-slate-400">
            Administra textos, contacto y publica cambios con ayuda asistida.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Contraseña de acceso
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none ring-cyan-400/30 focus:ring"
                autoComplete="current-password"
                required
              />
            </label>
            {error ? (
              <p className="text-sm text-rose-300" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
            >
              {busy ? "Entrando…" : "Entrar al controlador"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 bg-slate-950/90 lg:border-b-0 lg:border-r">
        <div className="px-4 py-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
            Controlador
          </p>
          <h1 className="mt-1 text-lg font-semibold text-white">
            {content.siteName}
          </h1>
          <p className="text-xs text-slate-500">Gestión de contenidos web</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                section === item.id
                  ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-400/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <span className="block font-medium">{item.label}</span>
              <span className="hidden text-[11px] text-slate-500 lg:block">
                {item.hint}
              </span>
            </button>
          ))}
        </nav>
        <div className="hidden px-4 py-4 lg:block">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 hover:bg-white/5"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {NAV.find((n) => n.id === section)?.label}
            </p>
            <p className="text-sm text-slate-300">
              Última publicación: {lastUpdateLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
            >
              {showPreview ? "Ocultar preview" : "Vista previa"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={runSpellcheck}
              className="rounded-lg border border-violet-400/30 px-3 py-1.5 text-xs text-violet-200 hover:bg-violet-400/10"
            >
              Revisar ortografía
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleSave()}
              className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
            >
              {busy ? "Guardando…" : "Guardar y publicar"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 lg:hidden"
            >
              Salir
            </button>
          </div>
        </header>

        {(error || message || spellInfo) && (
          <div className="space-y-1 border-b border-white/5 px-4 py-2 text-sm">
            {error ? <p className="text-rose-300">{error}</p> : null}
            {message ? <p className="text-emerald-300">{message}</p> : null}
            {spellInfo ? <p className="text-violet-200">{spellInfo}</p> : null}
          </div>
        )}

        <div
          className={`grid flex-1 gap-4 p-4 ${
            showPreview ? "xl:grid-cols-[minmax(0,1fr)_360px]" : ""
          }`}
        >
          <section className="space-y-4">
            {section === "resumen" ? (
              <Dashboard
                metrics={metrics}
                siteOnline={siteOnline}
                content={content}
                onGo={setSection}
              />
            ) : null}

            {section === "contacto" ? (
              <Card title="Datos de contacto">
                <Field
                  label="Nombre del estudio"
                  value={content.siteName}
                  onChange={(v) => setContent({ ...content, siteName: v })}
                />
                <Field
                  label="Correo"
                  value={content.contact.email}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: v },
                    })
                  }
                />
                <Field
                  label="Teléfono visible"
                  value={content.contact.phoneDisplay}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, phoneDisplay: v },
                    })
                  }
                />
                <Field
                  label="Teléfono enlace"
                  value={content.contact.phone}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, phone: v },
                    })
                  }
                />
                <Field
                  label="WhatsApp (solo números)"
                  value={content.contact.whatsappNumber}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, whatsappNumber: v },
                    })
                  }
                />
                <Field
                  label="Cobertura"
                  value={content.contact.coverage}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, coverage: v },
                    })
                  }
                />
              </Card>
            ) : null}

            {section === "inicio" ? (
              <Card title="Sección de inicio (Hero)">
                <Field
                  label="Etiqueta"
                  value={content.hero.badge}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, badge: v },
                    })
                  }
                />
                <Area
                  label="Título"
                  value={content.hero.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: v },
                    })
                  }
                />
                <Area
                  label="Subtítulo"
                  value={content.hero.subtitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: v },
                    })
                  }
                  rows={4}
                />
                <Field
                  label="Botón principal"
                  value={content.hero.ctaPrimary}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, ctaPrimary: v },
                    })
                  }
                />
                <Field
                  label="Botón secundario"
                  value={content.hero.ctaSecondary}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, ctaSecondary: v },
                    })
                  }
                />
                <Field
                  label="Título panel lateral"
                  value={content.hero.panelTitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, panelTitle: v },
                    })
                  }
                />
                <Field
                  label="Estado panel"
                  value={content.hero.panelStatus}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, panelStatus: v },
                    })
                  }
                />
                <Area
                  label="Aviso panel"
                  value={content.hero.panelDisclaimer}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, panelDisclaimer: v },
                    })
                  }
                />
                <ListEditor
                  label="Indicadores (uno por línea)"
                  values={content.hero.indicators}
                  onChange={(indicators) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, indicators },
                    })
                  }
                />
              </Card>
            ) : null}

            {section === "audiencia" ? (
              <Card title="Audiencia">
                <Field
                  label="Título"
                  value={content.audience.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      audience: { ...content.audience, title: v },
                    })
                  }
                />
                <Area
                  label="Subtítulo"
                  value={content.audience.subtitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      audience: { ...content.audience, subtitle: v },
                    })
                  }
                />
                {content.audience.blocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 p-3 space-y-2"
                  >
                    <Field
                      label={`Bloque ${idx + 1} — título`}
                      value={block.title}
                      onChange={(v) => {
                        const blocks = [...content.audience.blocks];
                        blocks[idx] = { ...blocks[idx], title: v };
                        setContent({
                          ...content,
                          audience: { ...content.audience, blocks },
                        });
                      }}
                    />
                    <Area
                      label="Texto"
                      value={block.body}
                      onChange={(v) => {
                        const blocks = [...content.audience.blocks];
                        blocks[idx] = { ...blocks[idx], body: v };
                        setContent({
                          ...content,
                          audience: { ...content.audience, blocks },
                        });
                      }}
                    />
                  </div>
                ))}
              </Card>
            ) : null}

            {section === "especialidades" ? (
              <Card title="Especialidades">
                <Field
                  label="Etiqueta"
                  value={content.practiceAreas.eyebrow}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      practiceAreas: { ...content.practiceAreas, eyebrow: v },
                    })
                  }
                />
                <Field
                  label="Título"
                  value={content.practiceAreas.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      practiceAreas: { ...content.practiceAreas, title: v },
                    })
                  }
                />
                <Area
                  label="Párrafo 1"
                  value={content.practiceAreas.subtitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      practiceAreas: { ...content.practiceAreas, subtitle: v },
                    })
                  }
                />
                <Area
                  label="Párrafo 2"
                  value={content.practiceAreas.subtitle2}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      practiceAreas: {
                        ...content.practiceAreas,
                        subtitle2: v,
                      },
                    })
                  }
                />
                <Field
                  label="Texto botón"
                  value={content.practiceAreas.cta}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      practiceAreas: { ...content.practiceAreas, cta: v },
                    })
                  }
                />
                {content.practiceAreas.areas.map((area, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-500">Área {idx + 1}</p>
                      <button
                        type="button"
                        className="text-xs text-rose-300"
                        onClick={() => {
                          const areas = content.practiceAreas.areas.filter(
                            (_, i) => i !== idx
                          );
                          setContent({
                            ...content,
                            practiceAreas: { ...content.practiceAreas, areas },
                          });
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                    <Field
                      label="Título"
                      value={area.title}
                      onChange={(v) => {
                        const areas = [...content.practiceAreas.areas];
                        areas[idx] = { ...areas[idx], title: v };
                        setContent({
                          ...content,
                          practiceAreas: { ...content.practiceAreas, areas },
                        });
                      }}
                    />
                    <Area
                      label="Descripción"
                      value={area.description}
                      onChange={(v) => {
                        const areas = [...content.practiceAreas.areas];
                        areas[idx] = { ...areas[idx], description: v };
                        setContent({
                          ...content,
                          practiceAreas: { ...content.practiceAreas, areas },
                        });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-slate-300"
                  onClick={() =>
                    setContent({
                      ...content,
                      practiceAreas: {
                        ...content.practiceAreas,
                        areas: [
                          ...content.practiceAreas.areas,
                          {
                            icon: "Scale",
                            title: "Nueva especialidad",
                            description: "Describe el servicio…",
                          },
                        ],
                      },
                    })
                  }
                >
                  + Agregar especialidad
                </button>
              </Card>
            ) : null}

            {section === "metodologia" ? (
              <Card title="Metodología">
                <Field
                  label="Título"
                  value={content.methodology.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      methodology: { ...content.methodology, title: v },
                    })
                  }
                />
                <Area
                  label="Subtítulo"
                  value={content.methodology.subtitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      methodology: { ...content.methodology, subtitle: v },
                    })
                  }
                />
                {content.methodology.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 p-3 space-y-2"
                  >
                    <Field
                      label={`Paso ${step.step} — título`}
                      value={step.title}
                      onChange={(v) => {
                        const steps = [...content.methodology.steps];
                        steps[idx] = { ...steps[idx], title: v };
                        setContent({
                          ...content,
                          methodology: { ...content.methodology, steps },
                        });
                      }}
                    />
                    <Area
                      label="Descripción"
                      value={step.description}
                      onChange={(v) => {
                        const steps = [...content.methodology.steps];
                        steps[idx] = { ...steps[idx], description: v };
                        setContent({
                          ...content,
                          methodology: { ...content.methodology, steps },
                        });
                      }}
                    />
                  </div>
                ))}
              </Card>
            ) : null}

            {section === "faq" ? (
              <Card title="Preguntas frecuentes">
                <Field
                  label="Título"
                  value={content.faq.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      faq: { ...content.faq, title: v },
                    })
                  }
                />
                <Field
                  label="Subtítulo"
                  value={content.faq.subtitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      faq: { ...content.faq, subtitle: v },
                    })
                  }
                />
                {content.faq.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 p-3 space-y-2"
                  >
                    <div className="flex justify-between">
                      <p className="text-xs text-slate-500">FAQ {idx + 1}</p>
                      <button
                        type="button"
                        className="text-xs text-rose-300"
                        onClick={() => {
                          const items = content.faq.items.filter(
                            (_, i) => i !== idx
                          );
                          setContent({
                            ...content,
                            faq: { ...content.faq, items },
                          });
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                    <Field
                      label="Pregunta"
                      value={item.question}
                      onChange={(v) => {
                        const items = [...content.faq.items];
                        items[idx] = { ...items[idx], question: v };
                        setContent({
                          ...content,
                          faq: { ...content.faq, items },
                        });
                      }}
                    />
                    <Area
                      label="Respuesta"
                      value={item.answer}
                      onChange={(v) => {
                        const items = [...content.faq.items];
                        items[idx] = { ...items[idx], answer: v };
                        setContent({
                          ...content,
                          faq: { ...content.faq, items },
                        });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-slate-300"
                  onClick={() =>
                    setContent({
                      ...content,
                      faq: {
                        ...content.faq,
                        items: [
                          ...content.faq.items,
                          {
                            question: "Nueva pregunta",
                            answer: "Escribe la respuesta…",
                          },
                        ],
                      },
                    })
                  }
                >
                  + Agregar pregunta
                </button>
              </Card>
            ) : null}

            {section === "formulario" ? (
              <Card title="Formulario de contacto">
                <Field
                  label="Título"
                  value={content.contactSection.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contactSection: { ...content.contactSection, title: v },
                    })
                  }
                />
                <Area
                  label="Descripción"
                  value={content.contactSection.description}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contactSection: {
                        ...content.contactSection,
                        description: v,
                      },
                    })
                  }
                />
                <ListEditor
                  label="Tipos de caso (uno por línea)"
                  values={content.contactSection.caseTypes}
                  onChange={(caseTypes) =>
                    setContent({
                      ...content,
                      contactSection: {
                        ...content.contactSection,
                        caseTypes,
                      },
                    })
                  }
                />
                <Field
                  label="Mensaje de éxito"
                  value={content.contactSection.successMessage}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contactSection: {
                        ...content.contactSection,
                        successMessage: v,
                      },
                    })
                  }
                />
                <Field
                  label="Mensaje de error"
                  value={content.contactSection.errorMessage}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      contactSection: {
                        ...content.contactSection,
                        errorMessage: v,
                      },
                    })
                  }
                />
              </Card>
            ) : null}

            {section === "chat" ? (
              <Card title="Chat flotante">
                <Field
                  label="Nombre del asistente"
                  value={content.chat.assistantName}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      chat: { ...content.chat, assistantName: v },
                    })
                  }
                />
                <Field
                  label="Subtítulo"
                  value={content.chat.subtitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      chat: { ...content.chat, subtitle: v },
                    })
                  }
                />
                <ListEditor
                  label="Mensajes proactivos"
                  values={content.chat.teaserMessages}
                  onChange={(teaserMessages) =>
                    setContent({
                      ...content,
                      chat: { ...content.chat, teaserMessages },
                    })
                  }
                />
                <ListEditor
                  label="Botones rápidos"
                  values={content.chat.welcomeQuickReplies}
                  onChange={(welcomeQuickReplies) =>
                    setContent({
                      ...content,
                      chat: { ...content.chat, welcomeQuickReplies },
                    })
                  }
                />
              </Card>
            ) : null}

            {section === "seo" ? (
              <Card title="SEO / Google">
                <Field
                  label="Título SEO"
                  value={content.seo.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, title: v },
                    })
                  }
                />
                <Area
                  label="Descripción"
                  value={content.seo.description}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, description: v },
                    })
                  }
                />
                <ListEditor
                  label="Palabras clave"
                  values={content.seo.keywords}
                  onChange={(keywords) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, keywords },
                    })
                  }
                />
                <label className="block text-sm text-slate-300">
                  Tema visual
                  <select
                    value={content.theme}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        theme: e.target.value as EditableContent["theme"],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white"
                  >
                    <option value="classic">Clásico dorado</option>
                    <option value="corporate-blue">Azul corporativo</option>
                    <option value="conservative">Conservador</option>
                  </select>
                </label>
              </Card>
            ) : null}

            {section === "pie" ? (
              <Card title="Pie de página y CTA">
                <Area
                  label="Título CTA"
                  value={content.strongCta.title}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      strongCta: { ...content.strongCta, title: v },
                    })
                  }
                />
                <Area
                  label="Subtítulo CTA"
                  value={content.strongCta.subtitle}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      strongCta: { ...content.strongCta, subtitle: v },
                    })
                  }
                />
                <Area
                  label="Descripción del pie"
                  value={content.footer.tagline}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, tagline: v },
                    })
                  }
                />
                <Field
                  label="Aviso legal"
                  value={content.footer.disclaimer}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, disclaimer: v },
                    })
                  }
                />
              </Card>
            ) : null}

            {section === "asistente" ? (
              <Card title="Asistente IA y soporte">
                <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl bg-black/30 p-3">
                  {chat.map((m, i) => (
                    <div
                      key={i}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        m.role === "assistant"
                          ? "bg-cyan-400/10 text-cyan-50"
                          : "bg-white/5 text-slate-200"
                      }`}
                    >
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">
                        {m.role === "assistant" ? "Copiloto" : "Tú"}
                      </p>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {assistantStarters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => askAssistant(s)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    askAssistant(chatInput);
                  }}
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pregúntame cómo editar o reportar un error…"
                    className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950"
                  >
                    Enviar
                  </button>
                </form>

                <div className="mt-4 space-y-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                  <p className="text-sm font-medium text-amber-100">
                    Pedir ayuda a Carlos
                  </p>
                  <p className="text-xs text-slate-400">
                    Se notifica a {supportEmail} automáticamente.
                  </p>
                  <Field
                    label="Tu correo (opcional, para respuesta)"
                    value={helpReplyEmail}
                    onChange={setHelpReplyEmail}
                  />
                  <Area
                    label="Describe el error o lo que necesitas"
                    value={helpMessage}
                    onChange={setHelpMessage}
                    rows={4}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => sendHelp("error")}
                      className="rounded-lg bg-rose-400/90 px-3 py-2 text-xs font-semibold text-slate-950"
                    >
                      Reportar error
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => sendHelp("ayuda")}
                      className="rounded-lg bg-amber-300 px-3 py-2 text-xs font-semibold text-slate-950"
                    >
                      Pedir ayuda / cambio
                    </button>
                  </div>
                </div>
              </Card>
            ) : null}

            {spellMatches.length > 0 ? (
              <Card title="Sugerencias ortográficas">
                <ul className="space-y-2">
                  {spellMatches.map((m, i) => (
                    <li
                      key={`${m.offset}-${i}`}
                      className="rounded-lg border border-violet-400/20 bg-violet-400/5 p-3 text-sm"
                    >
                      <p className="font-medium text-violet-100">
                        {m.shortMessage}
                      </p>
                      <p className="mt-1 text-slate-300">{m.message}</p>
                      <p className="mt-1 text-xs text-slate-500">…{m.snippet}…</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.replacements.map((r) => (
                          <span
                            key={r}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </section>

          {showPreview ? (
            <aside className="space-y-3 xl:sticky xl:top-20 xl:self-start">
              <LivePreview content={content} />
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400">
                Vista previa orientativa del inicio y contacto. Al guardar, la
                web real se actualiza en 1–2 minutos.
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Dashboard({
  metrics,
  siteOnline,
  content,
  onGo,
}: {
  metrics: Metrics | null;
  siteOnline: boolean | null;
  content: EditableContent;
  onGo: (id: SectionId) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Sitio"
          value={
            siteOnline == null ? "…" : siteOnline ? "En línea" : "Revisar"
          }
          tone={siteOnline ? "ok" : siteOnline === false ? "bad" : "neutral"}
        />
        <Metric
          label="Completitud"
          value={`${metrics?.completeness ?? 0}%`}
          tone="ok"
        />
        <Metric label="Especialidades" value={String(metrics?.areas ?? 0)} />
        <Metric label="FAQs" value={String(metrics?.faqs ?? 0)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Audiencia" value={String(metrics?.audience ?? 0)} />
        <Metric label="Pasos método" value={String(metrics?.steps ?? 0)} />
        <Metric label="Volumen texto" value={`${metrics?.words ?? 0} tok`} />
      </div>
      <Card title="Accesos rápidos">
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["contacto", "Editar correo y teléfonos"],
              ["inicio", "Cambiar título principal"],
              ["especialidades", "Administrar áreas"],
              ["asistente", "Pedir ayuda a Carlos"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onGo(id)}
              className="rounded-xl border border-white/10 px-3 py-3 text-left text-sm text-slate-200 hover:bg-white/5"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Contacto público actual: {content.contact.email} ·{" "}
          {content.contact.phoneDisplay}
        </p>
      </Card>
    </div>
  );
}

function LivePreview({ content }: { content: EditableContent }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 shadow-xl">
      <div className="border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">
        Preview · inicio
      </div>
      <div className="space-y-3 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/80">
          {content.hero.badge}
        </p>
        <h2 className="font-serif text-xl leading-snug text-white">
          {content.hero.title}
        </h2>
        <p className="text-xs leading-relaxed text-slate-400">
          {content.hero.subtitle}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-lg bg-cyan-400 px-2.5 py-1 text-[11px] font-semibold text-slate-950">
            {content.hero.ctaPrimary}
          </span>
          <span className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-slate-300">
            {content.hero.ctaSecondary}
          </span>
        </div>
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] text-slate-500">Contacto</p>
          <p className="text-sm text-slate-200">{content.contact.email}</p>
          <p className="text-sm text-slate-200">{content.contact.phoneDisplay}</p>
          <p className="text-xs text-slate-500">{content.contact.coverage}</p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "ok" | "bad" | "neutral";
}) {
  const color =
    tone === "ok"
      ? "text-emerald-300"
      : tone === "bad"
        ? "text-rose-300"
        : "text-white";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <input
        type="text"
        value={value}
        spellCheck
        lang="es"
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none ring-cyan-400/30 focus:ring"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <textarea
        value={value}
        rows={rows}
        spellCheck
        lang="es"
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none ring-cyan-400/30 focus:ring"
      />
    </label>
  );
}

function ListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <textarea
        value={values.join("\n")}
        rows={Math.min(8, Math.max(3, values.length + 1))}
        spellCheck
        lang="es"
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
          )
        }
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none ring-cyan-400/30 focus:ring"
      />
    </label>
  );
}

function spellcheckCorpus(content: EditableContent, section: SectionId): string {
  switch (section) {
    case "inicio":
      return [
        content.hero.badge,
        content.hero.title,
        content.hero.subtitle,
        content.hero.ctaPrimary,
        content.hero.ctaSecondary,
      ].join("\n");
    case "contacto":
      return [content.siteName, content.contact.coverage].join("\n");
    case "audiencia":
      return [
        content.audience.title,
        content.audience.subtitle,
        ...content.audience.blocks.flatMap((b) => [b.title, b.body]),
      ].join("\n");
    case "especialidades":
      return [
        content.practiceAreas.title,
        content.practiceAreas.subtitle,
        content.practiceAreas.subtitle2,
        ...content.practiceAreas.areas.flatMap((a) => [a.title, a.description]),
      ].join("\n");
    case "faq":
      return content.faq.items
        .flatMap((i) => [i.question, i.answer])
        .join("\n");
    case "pie":
      return [
        content.strongCta.title,
        content.strongCta.subtitle,
        content.footer.tagline,
        content.footer.disclaimer,
      ].join("\n");
    default:
      return [
        content.hero.title,
        content.hero.subtitle,
        content.audience.title,
        content.practiceAreas.title,
        content.faq.title,
        content.footer.tagline,
      ].join("\n");
  }
}
