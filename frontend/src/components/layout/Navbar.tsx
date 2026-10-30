import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTheme } from "@/context/ThemeContext";
import { useLocalized } from "@/hooks/useLocalized";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export const SECTIONS = ["hero", "about", "resume", "skills", "projects", "contact"] as const;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
    <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
  </svg>
);

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { lang, pick } = useLocalized();
  const { theme, toggle: toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const { data } = usePortfolio();
  const active = useScrollSpy(SECTIONS);
  const [open, setOpen] = useState(false);

  // The projects link only appears once there is something to show (or for the admin, to add some).
  const links = SECTIONS.filter((id) => id !== "hero" && (id !== "projects" || isAdmin || data.projects.length > 0));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleLang = () => void i18n.changeLanguage(lang === "ar" ? "en" : "ar");
  const iconBtn = "grid size-11 place-items-center rounded-full transition-colors hover:bg-bg2 active:scale-95";

  return (
    // A floating pill rather than a full-width bar: no edges touch the sides of the window.
    <header className="sticky top-3 z-50 container-x mt-3">
      <nav
        className="flex h-16 items-center justify-between gap-6 rounded-full bg-bg/85 ps-6 pe-2 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md"
        aria-label={t("nav.menu")}
      >
        <a href="#hero" className="text-lg font-bold whitespace-nowrap">
          {pick(data.settings, "hero_title")}
        </a>

        <ul className="hidden gap-1 lg:flex">
          {links.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`block rounded-full px-4 py-2 font-medium transition-colors ${active === id ? "bg-accent/12 text-accent" : "text-fg hover:bg-bg2"}`}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button type="button" onClick={toggleLang} lang={lang === "ar" ? "en" : "ar"} className="min-h-11 rounded-full px-4 font-bold transition-colors hover:bg-bg2">
            {t("common.switchLang")}
          </button>
          <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? t("common.toLight") : t("common.toDark")} className={iconBtn}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className={`${iconBtn} lg:hidden`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.close") : t("nav.menu")}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="mt-2 grid rounded-block bg-bg/95 p-4 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md lg:hidden">
          {links.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-full px-4 py-3 text-2xl font-bold ${active === id ? "bg-accent/12 text-accent" : ""}`}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
