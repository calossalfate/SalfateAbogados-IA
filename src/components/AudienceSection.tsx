import { User, Building, Landmark } from "lucide-react";

const blocks = [
  {
    icon: User,
    title: "Personas naturales",
    body: "Defensa en conflictos con la administración, familia, civil, penal menor y consumo. Acompañamiento cercano y explicaciones claras en cada etapa.",
  },
  {
    icon: Building,
    title: "Empresas proveedoras del Estado",
    body: "Licitaciones, impugnaciones, contratos con organismos públicos y cumplimiento normativo. Enfoque en continuidad del negocio y gestión de riesgos.",
  },
  {
    icon: Landmark,
    title: "Funcionarios públicos e instituciones",
    body: "Sumarios, reclamos administrativos, asesoría institucional y representación ante tribunales y órganos fiscalizadores.",
  },
];

export function AudienceSection() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl max-w-2xl">
          Quienes confían en nuestro trabajo
        </h2>
        <p className="mt-4 max-w-2xl text-muted leading-relaxed">
          Ajustamos el servicio al perfil del cliente, con la misma exigencia
          técnica en cada mandato.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {blocks.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl glass p-8 flex flex-col border-t-2 border-accent/40"
            >
              <Icon className="h-8 w-8 text-accent" strokeWidth={1.25} />
              <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted flex-1">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
