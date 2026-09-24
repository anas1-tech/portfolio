import { ArrowDownOutlined, DownloadOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import SocialLinks from "@/components/ui/SocialLinks";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function Hero() {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const { data } = usePortfolio();
  const { settings } = data;
  const subtitle = pick(settings, "hero_subtitle");
  const typed = useTypewriter(subtitle);

  const stats = [
    { value: data.projects.length, label: t("stats.projects") },
    { value: data.skills.length, label: t("stats.skills") },
    { value: data.courses.length, label: t("stats.courses") },
  ];

  return (
    <section id="hero" className="relative grid min-h-svh place-items-center overflow-hidden pt-36 pb-16 text-center">
      <div className="pointer-events-none absolute -top-32 -start-32 size-[480px] animate-[float_14s_ease-in-out_infinite] rounded-full bg-accent opacity-35 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-36 -end-24 size-[480px] animate-[float_14s_ease-in-out_-6s_infinite] rounded-full bg-accent2 opacity-35 blur-[110px]" />

      <div className="container-x relative z-10 flex flex-col items-center gap-4">
        <div className="grad-bg rounded-full p-[5px] shadow-[0_0_60px_-10px_var(--accent)]">
          <img src="/profile.jpeg" alt="" className="size-[170px] rounded-full border-4 border-bg object-cover" />
        </div>

        <p className="mt-2 text-lg text-muted">{t("hero.hello")}</p>
        <h1 className="grad-text text-[clamp(2.4rem,8vw,5rem)] font-extrabold">{pick(settings, "hero_title")}</h1>
        <p className="min-h-8 text-[clamp(1.05rem,2.6vw,1.4rem)] text-muted" aria-label={subtitle}>
          {typed}
          <i className="ms-1 inline-block h-[1.1em] w-0.5 animate-[blink_1s_steps(1)_infinite] bg-accent2 align-[-0.15em]" />
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<DownloadOutlined />}
            href={`/cv-${lang}.pdf`}
            target="_blank"
            className="grad-bg border-0 shadow-[0_10px_30px_-10px_var(--accent)]"
          >
            {t("hero.cv")}
          </Button>
          <Button size="large" shape="round" icon={<MailOutlined />} href="#contact">
            {t("hero.contact")}
          </Button>
        </div>

        <SocialLinks settings={settings} />

        <ul className="mt-6 flex gap-[clamp(1.5rem,6vw,3.5rem)] border-t border-line pt-6">
          {stats.map((s) => (
            <li key={s.label}>
              <Statistic title={s.label} value={s.value} />
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#about"
        aria-label={t("nav.about")}
        className="absolute inset-x-0 bottom-6 mx-auto hidden size-10 animate-[bob_2s_ease-in-out_infinite] place-items-center rounded-full border border-line text-muted sm:grid"
      >
        <ArrowDownOutlined />
      </a>
    </section>
  );
}
