import type { Project, SiteSettings } from "@/types/api";

export const settingsFixture: SiteSettings = {
  hero_title_ar: "أنس", hero_title_en: "Anas",
  hero_subtitle_ar: "طالب", hero_subtitle_en: "Student",
  about_text_ar: "", about_text_en: "",
  address_ar: "", address_en: "",
  email: "", whatsapp: "", twitter: "", linkedin: "", github: "",
};

export const makeProject = (overrides: Partial<Project> & Pick<Project, "id">): Project => ({
  title_ar: `مشروع ${overrides.id}`,
  title_en: `Project ${overrides.id}`,
  desc_ar: "",
  desc_en: "",
  techs: [],
  image: null,
  url: "",
  repo: "",
  ...overrides,
});

export const projectsFixture: Project[] = [
  makeProject({ id: 1, techs: ["React", "Django"], image: "/media/a.webp" }),
  makeProject({ id: 2, techs: ["React", "Vite"] }),
  makeProject({ id: 3, techs: ["Python"], url: "https://demo.example.com", repo: "https://github.com/x/y" }),
];
