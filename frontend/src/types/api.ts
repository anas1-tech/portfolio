export type Lang = "ar" | "en";

export interface SiteSettings {
  hero_title_ar: string;
  hero_title_en: string;
  hero_subtitle_ar: string;
  hero_subtitle_en: string;
  about_text_ar: string;
  about_text_en: string;
  address_ar: string;
  address_en: string;
  email: string;
  whatsapp: string;
  twitter: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  id: number;
  type: "exp" | "edu";
  title_ar: string;
  title_en: string;
  place_ar: string;
  place_en: string;
  date_ar: string;
  date_en: string;
}

export interface Skill {
  id: number;
  name_ar: string;
  name_en: string;
}

export interface Course {
  id: number;
  name_ar: string;
  name_en: string;
  date_ar: string;
  date_en: string;
}

export interface Project {
  id: number;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  techs: string[];
  image: string | null;
  url: string;
  repo: string;
}

export interface Portfolio {
  settings: SiteSettings;
  experiences: Experience[];
  skills: Skill[];
  courses: Course[];
  projects: Project[];
}

/** What the admin can edit through the generic form. */
export type EntityKind = "settings" | "experience" | "skill" | "course" | "project";
export type EntityItem = Experience | Skill | Course | Project;

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot: real visitors never fill this in. */
  website?: string;
}

export interface SystemLink {
  key: "site" | "api" | "admin";
  url: string;
}

export interface SystemInfo {
  links: SystemLink[];
  database: {
    engine: string;
    ok: boolean;
    counts: {
      projects: number;
      skills: number;
      courses: number;
      experiences: number;
      messages: number;
      unread_messages: number;
    };
  };
}
