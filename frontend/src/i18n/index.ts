import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import type { Lang } from "@/types/api";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

export const LANG_KEY = "lang";

/** `?lang=en` in the URL wins (it is the address search engines index for English), then the saved choice. */
const readSaved = (): Lang => {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (fromUrl === "en" || fromUrl === "ar") return fromUrl;
  try {
    return localStorage.getItem(LANG_KEY) === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
};

export const dirOf = (lng: string): "rtl" | "ltr" => (lng === "ar" ? "rtl" : "ltr");

/** Keeps <html lang dir>, the URL and localStorage in step with the active language. */
function applyLanguage(lng: string) {
  document.documentElement.lang = lng;
  document.documentElement.dir = dirOf(lng);
  const url = new URL(window.location.href);
  if (lng === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");
  if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  try {
    localStorage.setItem(LANG_KEY, lng);
  } catch {
    /* ignore */
  }
}

void i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: readSaved(),
  fallbackLng: "ar",
  interpolation: { escapeValue: false }, // React already escapes
});

applyLanguage(i18n.language);
i18n.on("languageChanged", applyLanguage);

export default i18n;
