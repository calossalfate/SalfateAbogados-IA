"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#ia-legal", label: "IA Legal" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/10 py-3"
          : "border-b border-white/5 bg-gradient-to-b from-black/55 via-black/30 to-transparent py-5 backdrop-blur-[2px]"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#inicio"
          className={`font-display text-xl tracking-tight sm:text-2xl ${
            scrolled
              ? "font-semibold text-ink"
              : "font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          }`}
        >
          Salfate{" "}
          <span className="text-accent drop-shadow-[0_0_12px_rgba(201,169,98,0.35)]">
            Abogados
          </span>
        </Link>

        <nav
          className={`hidden lg:flex items-center gap-8 text-sm ${
            scrolled ? "font-normal text-muted" : "font-medium text-white/95"
          }`}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors [text-shadow:0_1px_4px_rgba(0,0,0,0.45)] ${
                scrolled
                  ? "hover:text-accent"
                  : "hover:text-accent hover:[text-shadow:0_0_12px_rgba(201,169,98,0.25)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-petrol-300 shadow-md shadow-black/30 transition hover:bg-accent-soft"
          >
            Agenda una consulta
          </Link>
        </div>

        <button
          type="button"
          className={`lg:hidden rounded-lg p-2 hover:bg-white/10 ${
            scrolled ? "text-ink" : "text-white drop-shadow-md"
          }`}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 glass px-4 py-4">
          <nav className="flex flex-col gap-3 text-sm text-ink">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#contacto"
              className="mt-2 inline-flex justify-center rounded-full bg-accent px-4 py-3 text-sm font-medium text-petrol-300"
              onClick={() => setOpen(false)}
            >
              Agenda una consulta
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
