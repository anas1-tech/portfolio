import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { AddButton, ItemControls } from "@/components/admin/AdminControls";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";

/** Skills set as large words on one side, the courses as a dated list on the other. */
export default function Skills() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data } = usePortfolio();

  return (
    <Section id="skills" title={t("skills.title")} action={<AddButton kind="skill" />}>
      <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
        <ul className="grid content-start gap-4">
          {data.skills.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3" data-reveal style={{ "--i": i } as CSSProperties}>
              <span className="text-[clamp(1.75rem,3.4vw,3rem)] leading-tight font-bold">{pick(s, "name")}</span>
              <ItemControls kind="skill" item={s} />
            </li>
          ))}
        </ul>

        <div id="courses" className="self-start rounded-block bg-sand p-8 text-sand-ink md:p-10" data-reveal style={{ "--i": 2 } as CSSProperties}>
          <div className="mb-8 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-bold">{t("courses.title")}</h3>
            <AddButton kind="course" />
          </div>
          <ul className="grid gap-6">
            {data.courses.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-6">
                <span className="text-lg leading-snug font-medium">{pick(c, "name")}</span>
                <span className="flex shrink-0 items-center gap-2 font-bold tabular-nums">
                  {pick(c, "date")}
                  <ItemControls kind="course" item={c} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
