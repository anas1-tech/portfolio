import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { AddButton, ItemControls } from "@/components/admin/AdminControls";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import type { Experience } from "@/types/api";

/** One group (work or education): its name in the first column, the entries as large rows beside it. */
function Group({ title, items }: { title: string; items: Experience[] }) {
  const { pick } = useLocalized();
  if (items.length === 0) return null;
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(10rem,1fr)_3fr] md:gap-12">
      <h3 className="text-xl font-bold text-muted" data-reveal>
        {title}
      </h3>
      <ol className="grid gap-10">
        {items.map((e, i) => (
          <li key={e.id} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-8" data-reveal style={{ "--i": i + 1 } as CSSProperties}>
            <div>
              <div className="flex items-start gap-3">
                <h4 className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-bold">{pick(e, "title")}</h4>
                <ItemControls kind="experience" item={e} />
              </div>
              {pick(e, "place") && <p className="mt-2 text-lg">{pick(e, "place")}</p>}
            </div>
            {pick(e, "date") && <p className="text-lg font-medium text-muted tabular-nums sm:pt-2 sm:text-end">{pick(e, "date")}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Resume() {
  const { t } = useTranslation();
  const { data } = usePortfolio();
  const of = (type: Experience["type"]) => data.experiences.filter((e) => e.type === type);

  return (
    <Section id="resume" title={t("resume.title")} action={<AddButton kind="experience" />} className="bg-bg2">
      <div className="grid gap-20">
        <Group title={t("resume.experience")} items={of("exp")} />
        <Group title={t("resume.education")} items={of("edu")} />
      </div>
    </Section>
  );
}
