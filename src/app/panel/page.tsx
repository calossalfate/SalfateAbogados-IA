"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { EditableContent } from "@/lib/content/editable";

type TabId = "contacto" | "textos" | "pie";

const emptyContent: EditableContent = {
  siteName: "",
  contact: {
    email: "",
    phone: "",
    phoneDisplay: "",
    whatsappNumber: "",
    coverage: "",
  },
  hero: {
    badge: "",
    title: "",
    subtitle: "",
    ctaPrimary: "",
    ctaSecondary: "",
  },
  contactSection: {
    title: "",
    description: "",
  },
  strongCta: {
    title: "",
    subtitle: "",
  },
  footer: {
    tagline: "",
    disclaimer: "",
  },
};

export default function PanelPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState<EditableContent>(emptyContent);
  const [tab, setTab] = useState<TabId>("contacto");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const data = (await res.json()) as { content: EditableContent };
    setContent(data.content);
    setAuthed(true);
  }, []);

  useEffect(() => {
    loadContent().finally(() => setChecking(false));
  }, [loadContent]);

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
    setContent(emptyContent);
    setMessage(null);
    setError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
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
      } | null;
      if (!res.ok) {
        setError(data?.error || "No se pudo guardar.");
        return;
      }
      if (data?.content) setContent(data.content);
      setMessage(data?.message || "Guardado correctamente.");
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-4">
        <p className="text-slate-400">Cargando panel…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">
            Salfate Abogados
          </p>
          <h1 className="mt-2 font-serif text-3xl text-white">
            Panel de edición
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Edita correo, teléfonos y textos de la web sin tocar código.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none ring-amber-400/40 focus:ring"
                autoComplete="current-password"
                required
              />
            </label>
            {error ? (
              <p className="text-sm text-red-300" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-amber-500/90 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
            >
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">
            Salfate Abogados
          </p>
          <h1 className="font-serif text-3xl text-white">Panel de edición</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cambia contacto y textos. Luego pulsa Guardar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
        >
          Salir
        </button>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["contacto", "Contacto"],
            ["textos", "Textos"],
            ["pie", "Pie y CTA"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              tab === id
                ? "bg-amber-500/90 text-slate-950"
                : "border border-white/15 text-slate-300 hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      >
        {tab === "contacto" ? (
          <>
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
              hint="Ej: +56 9 9154 5512"
            />
            <Field
              label="Teléfono (enlace llamar)"
              value={content.contact.phone}
              onChange={(v) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, phone: v },
                })
              }
              hint="Ej: +56991545512"
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
              hint="Ej: 56991545512"
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
          </>
        ) : null}

        {tab === "textos" ? (
          <>
            <Field
              label="Etiqueta superior (hero)"
              value={content.hero.badge}
              onChange={(v) =>
                setContent({ ...content, hero: { ...content.hero, badge: v } })
              }
            />
            <TextArea
              label="Título principal"
              value={content.hero.title}
              onChange={(v) =>
                setContent({ ...content, hero: { ...content.hero, title: v } })
              }
              rows={2}
            />
            <TextArea
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
              label="Título sección contacto"
              value={content.contactSection.title}
              onChange={(v) =>
                setContent({
                  ...content,
                  contactSection: { ...content.contactSection, title: v },
                })
              }
            />
            <TextArea
              label="Descripción sección contacto"
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
              rows={3}
            />
          </>
        ) : null}

        {tab === "pie" ? (
          <>
            <TextArea
              label="Título llamado a la acción"
              value={content.strongCta.title}
              onChange={(v) =>
                setContent({
                  ...content,
                  strongCta: { ...content.strongCta, title: v },
                })
              }
              rows={2}
            />
            <TextArea
              label="Subtítulo llamado a la acción"
              value={content.strongCta.subtitle}
              onChange={(v) =>
                setContent({
                  ...content,
                  strongCta: { ...content.strongCta, subtitle: v },
                })
              }
              rows={2}
            />
            <TextArea
              label="Descripción del pie"
              value={content.footer.tagline}
              onChange={(v) =>
                setContent({
                  ...content,
                  footer: { ...content.footer, tagline: v },
                })
              }
              rows={2}
            />
            <Field
              label="Aviso legal del pie"
              value={content.footer.disclaimer}
              onChange={(v) =>
                setContent({
                  ...content,
                  footer: { ...content.footer, disclaimer: v },
                })
              }
            />
          </>
        ) : null}

        {error ? (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="text-sm text-emerald-300" role="status">
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-amber-500/90 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
          >
            {busy ? "Guardando…" : "Guardar cambios"}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
          >
            Ver sitio
          </a>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none ring-amber-400/40 focus:ring"
      />
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none ring-amber-400/40 focus:ring"
      />
    </label>
  );
}
