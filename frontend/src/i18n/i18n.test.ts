import { describe, expect, it } from "vitest";
import i18n, { dirOf, LANG_KEY } from "./index";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

const flatten = (obj: object, prefix = ""): string[] =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === "object" ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

describe("locale files", () => {
  it("define exactly the same keys in Arabic and English", () => {
    expect(flatten(ar).sort()).toEqual(flatten(en).sort());
  });

  it("have no empty strings", () => {
    const empty = (obj: object): string[] =>
      Object.entries(obj).flatMap(([k, v]) => (v && typeof v === "object" ? empty(v).map((p) => `${k}.${p}`) : v === "" ? [k] : []));
    expect(empty(ar)).toEqual([]);
    expect(empty(en)).toEqual([]);
  });
});

describe("language switching", () => {
  it("maps languages to text direction", () => {
    expect(dirOf("ar")).toBe("rtl");
    expect(dirOf("en")).toBe("ltr");
  });

  it("updates <html lang> and <html dir> and remembers the choice", async () => {
    await i18n.changeLanguage("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem(LANG_KEY)).toBe("ar");

    await i18n.changeLanguage("en");
    expect(document.documentElement.dir).toBe("ltr");
    expect(i18n.t("nav.projects")).toBe("Projects");
  });

  it("translates the same key differently per language", async () => {
    await i18n.changeLanguage("ar");
    expect(i18n.t("nav.projects")).toBe("المشاريع");
  });
});
