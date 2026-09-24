import { useTranslation } from "react-i18next";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";

export default function About() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data } = usePortfolio();
  return (
    <Section id="about" title={t("about.title")} eyebrow="01">
      <Reveal className="card p-6 text-[clamp(1.05rem,2vw,1.3rem)] leading-loose md:p-12">
        <p>{pick(data.settings, "about_text")}</p>
      </Reveal>
    </Section>
  );
}
