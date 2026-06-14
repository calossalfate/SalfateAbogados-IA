import Image from "next/image";
import Link from "next/link";
import { getPracticeIcon } from "@/lib/content/icons";
import type { SiteContent } from "@/lib/content/types";

type PracticeAreasProps = {
  practiceAreas: SiteContent["practiceAreas"];
};

export function PracticeAreas({ practiceAreas }: PracticeAreasProps) {
  return (
    <section
      id="especialidades"
      className="relative scroll-mt-24 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col-reverse gap-10 lg:mb-20 lg:flex-row lg:items-stretch lg:gap-16">
          <div className="relative z-10 flex flex-1 flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {practiceAreas.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
              {practiceAreas.title}
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              {practiceAreas.subtitle}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted/90">
              {practiceAreas.subtitle2}
            </p>
            <Link
              href="#contacto"
              className="mt-8 inline-flex w-fit items-center rounded-full border border-accent/40 px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/10 hover:text-accent-soft"
            >
              {practiceAreas.cta}
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
          {practiceAreas.areas.map(({ icon, title, description }) => {
            const Icon = getPracticeIcon(icon);
            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
