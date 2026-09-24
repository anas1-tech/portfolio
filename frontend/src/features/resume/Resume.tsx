import { BankOutlined, ReadOutlined } from "@ant-design/icons";
import { Tag, Timeline } from "antd";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import type { Experience } from "@/types/api";
import { AddButton, ItemControls } from "../admin/ItemControls";

function TimelineColumn({ title, icon, items }: { title: string; icon: ReactNode; items: Experience[] }) {
  const { pick } = useLocalized();
  return (
    <Reveal>
      <h3 className="mb-6 flex items-center gap-2.5 text-xl font-bold text-accent2">
        {icon} {title}
      </h3>
      <Timeline
        items={items.map((e) => ({
          key: e.id,
          children: (
            <div className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-[1.05rem] font-bold">{pick(e, "title")}</h4>
                <ItemControls kind="experience" item={e} />
              </div>
              {pick(e, "place") && <p className="mt-1 mb-2 text-[0.95rem] text-muted">{pick(e, "place")}</p>}
              {pick(e, "date") && <Tag color="purple">{pick(e, "date")}</Tag>}
            </div>
          ),
        }))}
      />
    </Reveal>
  );
}

export default function Resume() {
  const { t } = useTranslation();
  const { data } = usePortfolio();
  const of = (type: Experience["type"]) => data.experiences.filter((e) => e.type === type);

  return (
    <Section id="resume" title={t("resume.title")} eyebrow="02" action={<AddButton kind="experience" />}>
      <div className="grid gap-12 md:grid-cols-2">
        <TimelineColumn title={t("resume.experience")} icon={<BankOutlined />} items={of("exp")} />
        <TimelineColumn title={t("resume.education")} icon={<ReadOutlined />} items={of("edu")} />
      </div>
    </Section>
  );
}
