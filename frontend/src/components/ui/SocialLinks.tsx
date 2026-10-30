import { useTranslation } from "react-i18next";
import type { SiteSettings } from "@/types/api";

interface SocialLinksProps {
  settings: SiteSettings;
  className?: string;
}

/** Renders only the links that are filled in, so an empty setting never leaves a dead link. */
export default function SocialLinks({ settings, className = "" }: SocialLinksProps) {
  const { t } = useTranslation();
  const links: [string, string][] = [
    [settings.email && `mailto:${settings.email}`, t("contact.emailField")],
    [settings.whatsapp && `https://wa.me/${settings.whatsapp}`, "WhatsApp"],
    [settings.linkedin, "LinkedIn"],
    [settings.github, "GitHub"],
    [settings.twitter, "X"],
  ];

  return (
    <ul className={`flex flex-wrap gap-x-8 gap-y-3 text-xl font-bold ${className}`}>
      {links
        .filter(([href]) => href)
        .map(([href, label]) => (
          <li key={label}>
            <a
              href={href}
              className="link-grow inline-block py-1"
              {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
            >
              {label}
            </a>
          </li>
        ))}
    </ul>
  );
}
