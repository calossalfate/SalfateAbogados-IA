import { MessageSquare, FolderOpen, Compass, Handshake } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Evaluación inicial",
    description:
      "Reunión para entender hechos, partes, plazos y expectativas. Priorizamos claridad y confidencialidad desde el primer contacto.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Revisión documental",
    description:
      "Análisis ordenado de antecedentes, actuaciones administrativas y normativa aplicable al caso concreto.",
    icon: FolderOpen,
  },
  {
    step: "03",
    title: "Estrategia jurídica",
    description:
      "Diseño de alternativas procesales o administrativas, con evaluación de riesgos, costos y cronología razonable.",
    icon: Compass,
  },
  {
    step: "04",
    title: "Representación y seguimiento",
    description:
      "Presentación de escritos, audiencias y comunicación continua con informes de avance hasta cierre o nueva etapa.",
    icon: Handshake,
  },
];

export function Methodology() {
  return (
    <section
      id="metodologia"
      className="relative py-24 sm:py-28 scroll-mt-24 bg-petrol-200/20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Metodología
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Proceso transparente y ordenado, alineado a estándares de estudios
            que trabajan con sector público y litigación compleja.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, description, icon: Icon }) => (
            <li
              key={step}
              className="relative rounded-2xl glass p-6 flex flex-col"
            >
              <span className="font-display text-4xl font-semibold text-accent/40">
                {step}
              </span>
              <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted flex-1">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
