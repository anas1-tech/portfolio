import { describe, expect, it } from "vitest";
import { projectsFixture } from "@/test/fixtures";
import { collectTechs, filterByTech } from "./projects";

describe("collectTechs", () => {
  it("lists each technology once, in first-seen order", () => {
    expect(collectTechs(projectsFixture)).toEqual(["React", "Django", "Vite", "Python"]);
  });

  it("handles no projects", () => {
    expect(collectTechs([])).toEqual([]);
  });
});

describe("filterByTech", () => {
  it("returns everything when no filter is set", () => {
    expect(filterByTech(projectsFixture, null)).toHaveLength(3);
  });

  it("keeps only projects that use the technology", () => {
    expect(filterByTech(projectsFixture, "React").map((p) => p.id)).toEqual([1, 2]);
    expect(filterByTech(projectsFixture, "Python").map((p) => p.id)).toEqual([3]);
  });

  it("returns nothing for an unknown technology", () => {
    expect(filterByTech(projectsFixture, "Cobol")).toEqual([]);
  });
});
