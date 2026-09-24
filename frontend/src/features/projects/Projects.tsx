import { CodeOutlined, FolderOutlined, LinkOutlined } from "@ant-design/icons";
import { Empty, Tag } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import { collectTechs, filterByTech } from "@/lib/projects";
import { AddButton, ItemControls } from "../admin/ItemControls";

export default function Projects() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data } = usePortfolio();
  const [filter, setFilter] = useState<string | null>(null);

  const techs = useMemo(() => collectTechs(data.projects), [data.projects]);
  const visible = filterByTech(data.projects, filter);

  return (
    <Section id="projects" title={t("projects.title")} eyebrow="05" action={<AddButton kind="project" />}>
      {data.projects.length === 0 && <Empty description={t("projects.empty")} />}

      {techs.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group">
          <Tag.CheckableTag checked={filter === null} onChange={() => setFilter(null)}>
            {t("projects.all")}
          </Tag.CheckableTag>
          {techs.map((tech) => (
            <Tag.CheckableTag key={tech} checked={filter === tech} onChange={() => setFilter(filter === tech ? null : tech)}>
              {tech}
            </Tag.CheckableTag>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={p.id} as="article" delay={i * 80} className="card group flex flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl">
            <div className="aspect-[16/10] overflow-hidden bg-bg2">
              {p.image ? (
                <img src={p.image} alt="" loading="lazy" className="size-full object-cover object-top transition duration-700 group-hover:scale-105" />
              ) : (
                <div data-testid="project-placeholder" className="grad-bg grid size-full place-items-center text-5xl text-white/85">
                  <FolderOutlined />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold">{pick(p, "title")}</h3>
                <ItemControls kind="project" item={p} />
              </div>
              <p className="text-muted">{pick(p, "desc")}</p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {p.techs.map((tech) => (
                  <Tag key={tech} color="cyan">
                    {tech}
                  </Tag>
                ))}
              </div>
              {(p.url || p.repo) && (
                <div className="flex gap-5 text-sm font-semibold">
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-accent hover:underline">
                      <LinkOutlined /> {t("projects.live")}
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-accent hover:underline">
                      <CodeOutlined /> {t("projects.code")}
                    </a>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
