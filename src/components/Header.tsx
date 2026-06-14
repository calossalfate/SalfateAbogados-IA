"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#ia-legal", label: "Diagnóstico legal" },
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
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <Link
          href="#inicio"
          className="inline-flex min-w-0 shrink-0 items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-3.5"
          aria-label="Salfate Abogados — Inicio"
        >
          <span
            className={`relative flex shrink-0 items-center justify-center rounded-xl p-1.5 ring-1 transition ${
              scrolled
                ? "bg-white/10 ring-accent/25 shadow-md shadow-black/20"
                : "bg-black/35 ring-accent/40 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-sm"
            }`}
          >
            <BrandLogo
              variant="mark"
              priority
              className={
                scrolled
                  ? "brightness-110 contrast-110"
                  : "brightness-125 contrast-110 drop-shadow-[0_2px_8px_rgba(201,169,98,0.35)]"
              }
            />
          </span>
          <span
            className={`hidden min-w-0 font-display text-lg font-semibold leading-tight tracking-tight sm:block sm:text-xl ${
              scrolled
                ? ""
                : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            }`}
          >
            <span className={scrolled ? "text-ink" : "text-white"}>
              Salfate
            </span>{" "}
            <span className="text-accent">Abogados</span>
          </span>
        </Link>

        <nav
          className={`hidden flex-1 items-center justify-center gap-6 text-sm xl:gap-8 lg:flex ${
            scrolled ? "font-normal text-muted" : "font-medium text-white/95"
          }`}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap transition-colors [text-shadow:0_1px_4px_rgba(0,0,0,0.45)] ${
                scrolled
                  ? "hover:text-accent"
                  : "hover:text-accent hover:[text-shadow:0_0_12px_rgba(201,169,98,0.25)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-petrol-300 shadow-md shadow-black/30 transition hover:bg-accent-soft"
          >
            Agenda una consulta
          </Link>
        </div>

        <button
          type="button"
          className={`ml-auto shrink-0 rounded-lg p-2 hover:bg-white/10 lg:hidden ${
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
