import { describe, expect, it } from "vitest";
import { buildPayload } from "./payload";

describe("buildPayload", () => {
  it("returns plain JSON (arrays kept) when there is no file", () => {
    const body = buildPayload({ title_ar: "x", techs: ["React", "Django"], skipped: undefined }, null);
    expect(body).toEqual({ title_ar: "x", techs: ["React", "Django"] });
  });

  it("returns multipart with comma-joined tags when a file is attached", () => {
    const file = new File(["img"], "shot.png", { type: "image/png" });
    const body = buildPayload({ title_ar: "x", techs: ["React", "Django"], url: null }, file);

    expect(body).toBeInstanceOf(FormData);
    const form = body as FormData;
    expect(form.get("title_ar")).toBe("x");
    expect(form.get("techs")).toBe("React,Django");
    expect(form.get("image")).toBe(file);
    expect(form.has("url")).toBe(false); // null values are not sent
  });
});
