import { useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { AddButton, ItemControls } from "@/components/admin/AdminControls";
import Section from "@/components/ui/Section";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import { collectTechs, filterByTech } from "@/lib/projects";

/** Each project is a wide row: its picture on one side, its story on the other, alternating. */
export default function Projects() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { isAdmin } = useAuth();
  const { data } = usePortfolio();
  const [filter, setFilter] = useState<string | null>(null);

  const techs = useMemo(() => collectTechs(data.projects), [data.projects]);
  const visible = filterByTech(data.projects, filter);

  // Visitors never see an empty section; the admin sees it so they can add the first project.
  if (data.projects.length === 0 && !isAdmin) return null;

  const chip = (on: boolean) =>
    `min-h-11 px-4 font-bold transition-colors ${on ? "bg-fg text-bg" : "bg-bg2 hover:bg-fg hover:text-bg"}`;

  return (
    <Section id="projects" title={t("projects.title")} action={<AddButton kind="project" />}>
      {data.projects.length === 0 && <p className="text-xl text-muted">{t("projects.empty")}</p>}

      {techs.length > 1 && (
        <div className="mb-16 flex flex-wrap gap-2" role="group" aria-label={t("projects.filter")} data-reveal>
          <button type="button" aria-pressed={filter === null} className={chip(filter === null)} onClick={() => setFilter(null)}>
            {t("projects.all")}
          </button>
          {techs.map((tech) => (
            <button
              key={tech}
              type="button"
              aria-pressed={filter === tech}
              className={chip(filter === tech)}
              onClick={() => setFilter(filter === tech ? null : tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-24">
        {visible.map((p, i) => (
          <article key={p.id} className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16" data-reveal style={{ "--i": 1 } as CSSProperties}>
            <div className={`aspect-[16/10] overflow-hidden bg-bg2 ${i % 2 ? "lg:order-last" : ""}`}>
              {p.image ? (
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div data-testid="project-placeholder" className="grid size-full place-items-center bg-sand text-[clamp(4rem,10vw,8rem)] font-bold text-sand-ink" aria-hidden="true">
                  {pick(p, "title").charAt(0)}
                </div>
              )}
            </div>
            <div className="grid gap-5">
              <div className="flex items-start gap-3">
                <h3 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold">{pick(p, "title")}</h3>
                <ItemControls kind="project" item={p} />
              </div>
              {pick(p, "desc") && <p className="max-w-[55ch] text-lg">{pick(p, "desc")}</p>}
              {p.techs.length > 0 && <p className="font-medium text-muted">{p.techs.join(" · ")}</p>}
              {(p.url || p.repo) && (
                <div className="flex gap-8 text-lg font-bold">
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="link-grow text-accent">
                      {t("projects.live")}
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="link-grow text-accent">
                      {t("projects.code")}
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
