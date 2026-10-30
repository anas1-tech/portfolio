import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";

/** A farewell: the name returns at full width, and the quiet admin sign-in lives here, out of the nav. */
export default function Footer({ onLogin }: { onLogin: () => void }) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { isAdmin } = useAuth();
  const name = pick(usePortfolio().data.settings, "hero_title");

  return (
    <footer className="mx-3 mt-6 mb-3 rounded-block bg-fg pt-20 pb-10 text-bg md:mx-6 md:mb-6">
      <div className="container-x grid gap-12">
        <p className="text-2xl font-bold">{t("footer.thanks")}</p>
        <p className="text-[clamp(3rem,11vw,10rem)] leading-none font-bold tracking-tight" aria-hidden="true">
          {name}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <span>
            © {new Date().getFullYear()} {name}
          </span>
          <div className="flex gap-6">
            <a href="#hero" className="link-grow py-2">
              {t("footer.top")}
            </a>
            {!isAdmin && (
              <button type="button" onClick={onLogin} className="link-grow py-2">
                {t("auth.login")}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
