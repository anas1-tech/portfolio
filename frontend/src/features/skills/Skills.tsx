import { useTranslation } from "react-i18next";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import { AddButton, ItemControls } from "../admin/ItemControls";

export default function Skills() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data } = usePortfolio();
  return (
    <Section id="skills" title={t("skills.title")} eyebrow="03" action={<AddButton kind="skill" />}>
      <div className="flex flex-wrap gap-3">
        {data.skills.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 40}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-semibold transition hover:-translate-y-0.5 hover:border-accent"
          >
            {pick(s, "name")}
            <ItemControls kind="skill" item={s} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
