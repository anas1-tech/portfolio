import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import SocialLinks from "@/components/ui/SocialLinks";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import { useMakkahTime } from "@/hooks/useMakkahTime";
import ContactForm from "./ContactForm";

/** A solid cobalt plate closes the page. */
export default function Contact() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const { settings } = usePortfolio().data;
  const time = useMakkahTime(lang);

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-3 rounded-block bg-plate py-24 text-on-plate md:mx-6 md:py-40">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="flex flex-col gap-8">
          <h2 id="contact-title" className="h-section" data-reveal>
            {t("contact.title")}
          </h2>
          <p className="max-w-[30ch] text-[clamp(1.25rem,2vw,1.625rem)] leading-snug" data-reveal style={{ "--i": 1 } as CSSProperties}>
            {t("contact.text")}
          </p>
          <p className="text-lg font-medium" aria-live="off" data-reveal style={{ "--i": 2 } as CSSProperties}>
            {t("contact.localTime", { time })}
          </p>
          {/* Links here sit on cobalt, so their focus ring switches to the paper colour. */}
          <div className="mt-auto [--accent:var(--on-plate)]" data-reveal style={{ "--i": 3 } as CSSProperties}>
            <h3 className="mb-3 text-lg font-bold">{t("contact.direct")}</h3>
            <SocialLinks settings={settings} />
          </div>
        </div>
        <div data-reveal style={{ "--i": 2 } as CSSProperties}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
