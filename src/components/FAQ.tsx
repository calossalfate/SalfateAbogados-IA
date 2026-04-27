const items = [
  {
    q: "¿Atienden en todo Chile?",
    a: "Sí. Coordinamos reuniones presenciales cuando corresponde y atención remota segura para clientes en cualquier región.",
  },
  {
    q: "¿Pueden revisar una licitación pública?",
    a: "Trabajamos revisión de bases, ofertas, actas y estrategia de impugnación o defensa ante el Tribunal de Compras Públicas u otras instancias aplicables, según la etapa del procedimiento.",
  },
  {
    q: "¿Defienden funcionarios en sumarios administrativos?",
    a: "Sí. Acompañamos desde la notificación de inicio en la preparación de descargos, prueba y recursos, con foco en derechos del funcionario y debido proceso.",
  },
  {
    q: "¿El diagnóstico IA reemplaza una consulta legal?",
    a: "No. Es una herramienta orientativa de demostración. Solo un abogado, con antecedentes completos, puede entregar opinión jurídica válida para su caso.",
  },
  {
    q: "¿Pueden representar ante Contraloría o tribunales?",
    a: "Representamos en reclamos administrativos, defensa judicial y recursos ante tribunales superiores cuando la materia está dentro de nuestras áreas de trabajo acordadas con el cliente.",
  },
  {
    q: "¿Trabajan con empresas y personas naturales?",
    a: "Sí. Atendemos personas, empresas, fundaciones y organismos públicos o mixtos, según el encargo y conflicto planteado.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-28 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          Preguntas frecuentes
        </h2>
        <p className="mt-4 text-muted">
          Respuestas generales. Cada asunto requiere revisión particular.
        </p>

        <div className="mt-10 space-y-3">
          {items.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl glass border border-white/[0.07] px-5 py-1 open:pb-4 transition-colors hover:border-white/12"
            >
              <summary className="cursor-pointer list-none py-4 font-medium text-ink flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <span>{q}</span>
                <span className="text-accent text-lg leading-none group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-sm leading-relaxed text-muted border-t border-white/5 pt-3">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
