"use client";

import { User, Building, Landmark, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const iconMap: Record<string, LucideIcon> = {
  User,
  Building,
  Landmark,
};

export function AudienceSection() {
  const { audience } = useSiteContent();

  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl max-w-2xl">
          {audience.title}
        </h2>
        <p className="mt-4 max-w-2xl text-muted leading-relaxed">
          {audience.subtitle}
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {audience.blocks.map(({ icon, title, body }) => {
            const Icon = iconMap[icon] || User;
            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
