import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export type MarketingSection = {
  kicker: string;
  title: string;
  paragraphs: string[];
  points: string[];
};

export function MarketingLayout({
  eyebrow,
  title,
  lede,
  sections,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  sections: MarketingSection[];
}) {
  return (
    <div className="min-h-screen bg-[#f3efe4] text-[#1c1915]">
      <SiteHeader />
      <main>
        <section className="border-b border-[#e4dccb] bg-[#f7f3ea]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0e6b4f]">{eyebrow}</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight tracking-tight md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#5c564c]">{lede}</p>
          </div>
        </section>
        {sections.map((section, index) => (
          <section key={section.title} className={index % 2 === 0 ? "bg-[#f3efe4]" : "bg-[#fffdf8]"}>
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] md:py-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a3d18]">
                  {String(index + 1).padStart(2, "0")} · {section.kicker}
                </p>
                <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{section.title}</h2>
                <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#3d3832]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <ul className="h-fit space-y-3 rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
                {section.points.map((point) => (
                  <li key={point} className="border-b border-[#efe8da] pb-3 text-sm leading-relaxed last:border-0 last:pb-0">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
