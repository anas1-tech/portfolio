import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";

export default function About() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data } = usePortfolio();
  const study = data.experiences.find((e) => e.type === "edu");

  // Quick facts, all read from the editable content so the admin never has to touch code.
  const facts = [
    study && { label: t("about.studying"), value: pick(study, "title"), note: pick(study, "place") },
    pick(data.settings, "address") && { label: t("about.based"), value: pick(data.settings, "address") },
    data.settings.email && {
      label: t("about.reach"),
      value: (
        <a href={`mailto:${data.settings.email}`} dir="ltr" className="link-grow break-all">
          {data.settings.email}
        </a>
      ),
    },
  ].filter(Boolean) as { label: string; value: ReactNode; note?: string }[];

  return (
    <Section id="about" title={t("about.title")}>
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <p className="max-w-[38ch] text-[clamp(1.375rem,2.3vw,2rem)] leading-normal" data-reveal style={{ "--i": 1 } as CSSProperties}>
          {pick(data.settings, "about_text")}
        </p>
        {facts.length > 0 && (
          <dl className="grid content-start gap-8 rounded-block bg-bg2/80 p-8 md:p-10" data-reveal style={{ "--i": 2 } as CSSProperties}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-muted">{f.label}</dt>
                <dd className="mt-1 text-xl font-bold">{f.value}</dd>
                {f.note && <dd className="text-muted">{f.note}</dd>}
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  );
}
