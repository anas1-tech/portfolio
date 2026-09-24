import type { Project } from "@/types/api";

/** Every distinct technology across projects, in first-seen order. */
export function collectTechs(projects: Project[]): string[] {
  return [...new Set(projects.flatMap((p) => p.techs))];
}

export function filterByTech(projects: Project[], tech: string | null): Project[] {
  return tech ? projects.filter((p) => p.techs.includes(tech)) : projects;
}
