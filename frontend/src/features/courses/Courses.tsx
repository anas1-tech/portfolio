import { TrophyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import { AddButton, ItemControls } from "../admin/ItemControls";

export default function Courses() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data } = usePortfolio();
  return (
    <Section id="courses" title={t("courses.title")} eyebrow="04" action={<AddButton kind="course" />}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.courses.map((c, i) => (
          <Reveal key={c.id} delay={i * 60} className="card flex items-center gap-4 px-5 py-4 hover:-translate-y-0.5">
            <span className="grad-bg grid size-11 shrink-0 place-items-center rounded-2xl text-xl text-white">
              <TrophyOutlined />
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold">{pick(c, "name")}</h4>
              {pick(c, "date") && <p className="text-sm text-muted">{pick(c, "date")}</p>}
            </div>
            <ItemControls kind="course" item={c} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
