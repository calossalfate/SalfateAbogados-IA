import type { SiteContent } from "@/lib/content/types";

type FAQProps = {
  faq: SiteContent["faq"];
};

export function FAQ({ faq }: FAQProps) {
  return (
    <section id="faq" className="relative py-24 sm:py-28 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          {faq.title}
        </h2>
        <p className="mt-4 text-muted">{faq.subtitle}</p>

        <div className="mt-10 space-y-3">
          {faq.items.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-xl glass border border-white/[0.07] px-5 py-1 open:pb-4 transition-colors hover:border-white/12"
            >
              <summary className="cursor-pointer list-none py-4 font-medium text-ink flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <span>{question}</span>
                <span className="text-accent text-lg leading-none group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-sm leading-relaxed text-muted border-t border-white/5 pt-3">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
