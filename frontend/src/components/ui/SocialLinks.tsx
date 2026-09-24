import { GithubOutlined, LinkedinOutlined, MailOutlined, WhatsAppOutlined, XOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import type { SiteSettings } from "@/types/api";

interface SocialLinksProps {
  settings: SiteSettings;
  /** Use on the gradient contact card, where the default colors would disappear. */
  onGradient?: boolean;
}

/** Renders only the links that are filled in, so an empty setting never leaves a dead icon. */
export default function SocialLinks({ settings, onGradient = false }: SocialLinksProps) {
  const links: [string, ReactNode, string][] = [
    [settings.email && `mailto:${settings.email}`, <MailOutlined />, "Email"],
    [settings.whatsapp && `https://wa.me/${settings.whatsapp}`, <WhatsAppOutlined />, "WhatsApp"],
    [settings.twitter, <XOutlined />, "X"],
    [settings.linkedin, <LinkedinOutlined />, "LinkedIn"],
    [settings.github, <GithubOutlined />, "GitHub"],
  ];

  const base = "grid size-11 place-items-center rounded-full border text-lg transition duration-300 hover:-translate-y-1";
  const tone = onGradient
    ? "border-white/30 bg-white/20 text-white hover:bg-white hover:text-[#16162a]"
    : "border-line bg-surface hover:border-transparent hover:bg-accent hover:text-white";

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {links
        .filter(([href]) => href)
        .map(([href, icon, label]) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className={`${base} ${tone}`}>
            {icon}
          </a>
        ))}
    </div>
  );
}
