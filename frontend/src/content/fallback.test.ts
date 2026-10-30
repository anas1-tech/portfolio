import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import fallback from "./fallback.json";

describe("built-in content", () => {
  it("matches the backend's seed file, so a fresh database starts with what visitors already see", () => {
    const seed = JSON.parse(readFileSync(resolve(__dirname, "../../../backend/seed/content.json"), "utf-8"));
    expect(seed).toEqual(fallback);
  });
});
