import { describe, expect, it } from "vitest";
import { isLang, pickLocalized } from "./localize";

const item = { title_ar: "عنوان", title_en: "Title", place_ar: "مكان", place_en: "" };

describe("pickLocalized", () => {
  it("returns the field for the requested language", () => {
    expect(pickLocalized(item, "title", "ar")).toBe("عنوان");
    expect(pickLocalized(item, "title", "en")).toBe("Title");
  });

  it("falls back to the other language when a translation is empty", () => {
    expect(pickLocalized(item, "place", "en")).toBe("مكان");
  });

  it("returns an empty string for missing fields or missing items", () => {
    expect(pickLocalized(item, "nothing", "en")).toBe("");
    expect(pickLocalized(null, "title", "en")).toBe("");
    expect(pickLocalized(undefined, "title", "ar")).toBe("");
  });
});

describe("isLang", () => {
  it("accepts only the supported languages", () => {
    expect(isLang("ar")).toBe(true);
    expect(isLang("en")).toBe(true);
    expect(isLang("fr")).toBe(false);
  });
});
