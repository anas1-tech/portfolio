import { useTranslation } from "react-i18next";
import { isLang, pickLocalized } from "@/lib/localize";
import type { Lang } from "@/types/api";

/** Active content language plus `pick(item, "title")` to read the matching `title_ar` / `title_en`. */
export function useLocalized() {
  const { i18n } = useTranslation();
  const lang: Lang = isLang(i18n.language) ? i18n.language : "ar";
  return {
    lang,
    dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const),
    pick: (item: object | null | undefined, base: string) => pickLocalized(item, base, lang),
  };
}
