import { EnvironmentOutlined, MailOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/ui/Reveal";
import SocialLinks from "@/components/ui/SocialLinks";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";
import ContactForm from "./ContactForm";

export default function Contact() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { settings } = usePortfolio().data;
  const address = pick(settings, "address");

  return (
    <section id="contact" className="py-16 md:py-28">
      <div className="container-x">
        <Reveal className="grid gap-6 md:grid-cols-2">
          <div className="grad-bg relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.25),transparent_50%)]" />
            <h2 className="relative text-[clamp(1.8rem,5vw,3rem)] font-extrabold">{t("contact.title")}</h2>
            <p className="relative max-w-md opacity-90">{t("contact.text")}</p>
            {address && (
              <p className="relative inline-flex items-center gap-1.5">
                <EnvironmentOutlined /> {address}
              </p>
            )}
            {settings.email && (
              <Button className="relative" size="large" shape="round" icon={<MailOutlined />} href={`mailto:${settings.email}`}>
                {t("contact.email")}
              </Button>
            )}
            <div className="relative">
              <SocialLinks settings={settings} onGradient />
            </div>
          </div>
          <ContactForm />
        </Reveal>
        <footer className="mt-12 text-center text-sm text-muted">
          © {new Date().getFullYear()} {pick(settings, "hero_title")}
        </footer>
      </div>
    </section>
  );
}
