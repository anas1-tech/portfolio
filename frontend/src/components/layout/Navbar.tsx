import { GlobalOutlined, LockOutlined, MenuOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLocalized } from "@/hooks/useLocalized";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export const SECTIONS = ["hero", "about", "resume", "skills", "courses", "projects", "contact"] as const;

interface NavbarProps {
  onLogin: () => void;
}

export default function Navbar({ onLogin }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { lang } = useLocalized();
  const { theme, toggle: toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const active = useScrollSpy(SECTIONS);
  const [open, setOpen] = useState(false);

  const toggleLang = () => void i18n.changeLanguage(lang === "ar" ? "en" : "ar");

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 p-3.5">
      <nav className="glass pointer-events-auto mx-auto flex max-w-[1120px] items-center justify-between gap-4 rounded-full py-2 ps-5 pe-2">
        <a href="#hero" className="text-xl font-extrabold tracking-wider" aria-label={t("nav.hero")}>
          AB<span className="text-accent2">.</span>
        </a>

        <ul className="hidden gap-0.5 md:flex">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block rounded-full px-3.5 py-1.5 text-[0.92rem] font-medium transition ${
                  active === id ? "bg-surface-hover text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Button shape="round" icon={<GlobalOutlined />} onClick={toggleLang} aria-label={t("common.language")}>
            <b className="text-xs">{lang === "ar" ? "EN" : "ع"}</b>
          </Button>
          <Button
            shape="circle"
            icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            aria-label={t("common.theme")}
          />
          {!isAdmin && (
            <Button type="text" shape="circle" icon={<LockOutlined />} onClick={onLogin} aria-label={t("auth.login")} />
          )}
          <Button className="md:!hidden" shape="circle" icon={<MenuOutlined />} onClick={() => setOpen(true)} aria-label={t("nav.menu")} />
        </div>
      </nav>

      <Drawer placement="top" height={470} open={open} onClose={() => setOpen(false)} title={t("nav.menu")}>
        <ul className="grid gap-1">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-2.5 font-medium ${active === id ? "bg-surface-hover" : "text-muted"}`}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>
      </Drawer>
    </header>
  );
}
