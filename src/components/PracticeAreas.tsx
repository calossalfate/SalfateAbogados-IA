import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  FileText,
  AlertTriangle,
  Vote,
  Calculator,
  Shield,
  Users,
  Scale,
  Briefcase,
  Home,
  Droplets,
  FileSearch,
} from "lucide-react";

type Area = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const areas: Area[] = [
  {
    icon: Building2,
    title: "Derecho Público y Administrativo",
    description:
      "Organismos del Estado, procedimientos administrativos, fiscalización municipal y DOM, patentes comerciales, alcoholes y defensa de derechos en sede pública.",
  },
  {
    icon: FileText,
    title: "Compras Públicas y Licitaciones",
    description:
      "Impugnaciones, revisiones de bases, estrategia ante el Tribunal de Compras Públicas y acompañamiento a proveedores.",
  },
  {
    icon: AlertTriangle,
    title: "Sumarios Administrativos",
    description:
      "Defensa de funcionarios en investigaciones disciplinarias, descargos y recursos conforme a derecho.",
  },
  {
    icon: Vote,
    title: "Derecho Electoral",
    description:
      "Asesoría en materias electorales, reclamos y controversias ante órganos competentes del sistema electoral.",
  },
  {
    icon: Calculator,
    title: "Juicios de Cuenta",
    description:
      "Acompañamiento técnico en fiscalización de la gestión financiera de autoridades y entidades públicas.",
  },
  {
    icon: Shield,
    title: "Transparencia, Lobby y Contraloría",
    description:
      "Cumplimiento normativo, reclamos, toma de razón y estrategia frente a exigencias de transparencia y fiscalización.",
  },
  {
    icon: Users,
    title: "Fundaciones, Corporaciones y Organizaciones Comunitarias",
    description:
      "Constitución, modificaciones estatutarias, convenios con el Estado y gobernanza institucional.",
  },
  {
    icon: Scale,
    title: "Litigación en Tribunales Superiores",
    description:
      "Recursos ante Cortes de Apelaciones, Corte Suprema y defensa en sede del Tribunal Constitucional.",
  },
  {
    icon: Briefcase,
    title: "Derecho Laboral",
    description:
      "Negociación, finiquitos, despidos y representación en tribunales laborales y mediación.",
  },
  {
    icon: Home,
    title: "Derecho Civil, Penal, Familia, Tránsito y Consumidor",
    description:
      "Asesoría y litigación en materias civiles, penales, familia, tránsito y relaciones de consumo.",
  },
  {
    icon: Droplets,
    title: "Regularización de Propiedades y Derechos de Agua",
    description:
      "Bienes Nacionales, saneamiento, mensuras y regularización de situaciones dominiales y de uso de aguas.",
  },
  {
    icon: FileSearch,
    title: "Estudios de Títulos y Corretaje",
    description:
      "Revisión de cadena dominial, riesgos registrales y apoyo en operaciones inmobiliarias.",
  },
];

export function PracticeAreas() {
  return (
    <section
      id="especialidades"
      className="relative scroll-mt-24 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col-reverse gap-10 lg:mb-20 lg:flex-row lg:items-stretch lg:gap-16">
          <div className="relative z-10 flex flex-1 flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Derecho público
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Especialidades principales
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Equipo orientado a controversias con el sector público y a la
              asesoría integral, con profundidad técnica y visión práctica del
              entorno regulatorio chileno.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted/90">
              Acompañamos a personas, empresas e instituciones en procedimientos
              ante organismos del Estado, tribunales administrativos y
              fiscalización sectorial.
            </p>
            <Link
              href="#contacto"
              className="mt-8 inline-flex w-fit items-center rounded-full border border-accent/40 px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/10 hover:text-accent-soft"
            >
              Agendar conversación inicial →
            </Link>
          </div>

          <div className="relative z-0 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/30 lg:aspect-auto lg:min-h-[320px] lg:w-[46%] lg:max-w-none lg:shrink-0">
            <Image
              src="/derecho-publico.jpg"
              alt="Instituciones y asesoría en derecho público"
              fill
              quality={80}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-black/25 to-black/15"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 z-10 backdrop-blur-[1px]"
              aria-hidden
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group flex flex-col rounded-2xl glass p-6 transition hover:border-accent/25 hover:bg-white/[0.06]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition group-hover:bg-accent/25">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {description}
              </p>
              <Link
                href="#contacto"
                className="mt-5 inline-flex text-sm font-medium text-accent hover:text-accent-soft"
              >
                Consultar área →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
