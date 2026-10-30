import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLocalized } from "@/hooks/useLocalized";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// Softens the photo's top and side edges into the sand field, which is its own backdrop colour.
const FEATHER = "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent), linear-gradient(to bottom, transparent, #000 12%)";
const PHOTO_FEATHER: CSSProperties = { maskImage: FEATHER, WebkitMaskImage: FEATHER, maskComposite: "intersect", WebkitMaskComposite: "source-in" };

/**
 * The name, set very large, beside the portrait standing in a field of its own sand backdrop.
 * The same field closes the page in the contact section.
 */
export default function Hero() {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const { settings } = usePortfolio().data;
  const name = pick(settings, "hero_title");

  return (
    <section id="hero" className="grid min-h-[calc(100svh-4.75rem)] lg:grid-cols-[1.15fr_1fr]">
      {/* Start padding matches .container-x, so the name lines up with every section below. */}
      <div className="flex flex-col justify-center gap-8 px-[clamp(1rem,4vw,2rem)] py-14 lg:ps-[max(2rem,calc((100vw-1320px)/2))] lg:pe-12">
        <h1 className="hero-in text-[clamp(3.25rem,8.4vw,8.5rem)] font-bold" style={delay(0)}>
          {/* A non-breaking hyphen keeps "Al-Barnawi" together when the name wraps. */}
          {name.replaceAll("-", "‑")}
        </h1>
        <p className="hero-in max-w-[30ch] text-[clamp(1.25rem,2.2vw,1.875rem)] leading-snug" style={delay(120)}>
          {pick(settings, "hero_subtitle")}
        </p>
        <div className="hero-in flex flex-wrap items-center gap-x-8 gap-y-4" style={delay(240)}>
          <a href={`/cv-${lang}.pdf`} download className="btn btn-primary text-lg">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" />
            </svg>
            {t("hero.cv")}
          </a>
          <a href="#contact" className="link-grow py-1 text-lg font-bold">
            {t("hero.contact")}
          </a>
        </div>
      </div>

      <div className="relative order-first m-3 min-h-[52svh] overflow-hidden rounded-block bg-sand lg:order-none lg:my-6 lg:ms-0 lg:me-6 lg:min-h-0">
        <img
          src="/profile.webp"
          srcSet="/profile-300.webp 300w, /profile.webp 590w"
          sizes="(min-width: 1024px) 45vw, 100vw"
          width={590}
          height={693}
          alt={t("hero.photoAlt", { name })}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-x-0 bottom-0 mx-auto h-[96%] w-auto max-w-none origin-bottom animate-[settle_1.6s_var(--ease-out-expo)_both] object-contain"
          style={PHOTO_FEATHER}
        />
      </div>
    </section>
  );
}
