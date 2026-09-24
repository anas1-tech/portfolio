import type { Lang } from "@/types/api";

/**
 * Reads `<base>_<lang>` from a bilingual record, falling back to the other language
 * so a half-translated item never renders as an empty box.
 */
export function pickLocalized(item: object | null | undefined, base: string, lang: Lang): string {
  if (!item) return "";
  const record = item as Record<string, unknown>;
  const other: Lang = lang === "ar" ? "en" : "ar";
  const value = record[`${base}_${lang}`] || record[`${base}_${other}`];
  return typeof value === "string" ? value : "";
}

export const isLang = (value: string): value is Lang => value === "ar" || value === "en";
