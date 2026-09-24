import type { EntityKind, Lang } from "@/types/api";

export type FieldType = "text" | "textarea" | "select" | "tags" | "file" | "url" | "email";

export interface Field {
  name: string;
  /** i18n key under `admin.fields.*` */
  labelKey: string;
  /** Adds an AR/EN badge to the label and sets the input direction. */
  lang?: Lang;
  type?: FieldType;
  required?: boolean;
  /** Force left-to-right input (URLs, emails, code). */
  ltr?: boolean;
  options?: { value: string; labelKey: string }[];
}

export interface EntitySchema {
  /** REST resource name, e.g. "projects" -> /api/projects/ */
  endpoint: string;
  /** True for the one-row settings resource (PATCH /api/settings/, no id). */
  single?: boolean;
  fields: Field[];
}

/** A bilingual pair of fields: `<base>_ar` (required when asked) and `<base>_en`. */
const bilingual = (base: string, labelKey: string, opts: { type?: FieldType; requiredAr?: boolean } = {}): Field[] => [
  { name: `${base}_ar`, labelKey, lang: "ar", type: opts.type, required: opts.requiredAr },
  { name: `${base}_en`, labelKey, lang: "en", type: opts.type },
];

/** Every editable thing on the site. EntityFormModal renders any of these generically. */
export const schemas: Record<EntityKind, EntitySchema> = {
  settings: {
    endpoint: "settings",
    single: true,
    fields: [
      ...bilingual("hero_title", "hero_title"),
      ...bilingual("hero_subtitle", "hero_subtitle"),
      ...bilingual("about_text", "about_text", { type: "textarea" }),
      ...bilingual("address", "address"),
      { name: "email", labelKey: "email", type: "email", ltr: true },
      { name: "whatsapp", labelKey: "whatsapp", ltr: true },
      { name: "twitter", labelKey: "twitter", type: "url", ltr: true },
      { name: "linkedin", labelKey: "linkedin", type: "url", ltr: true },
      { name: "github", labelKey: "github", type: "url", ltr: true },
    ],
  },
  experience: {
    endpoint: "experiences",
    fields: [
      {
        name: "type",
        labelKey: "type",
        type: "select",
        required: true,
        options: [
          { value: "exp", labelKey: "type_exp" },
          { value: "edu", labelKey: "type_edu" },
        ],
      },
      ...bilingual("title", "title", { requiredAr: true }),
      ...bilingual("place", "place"),
      ...bilingual("date", "date"),
    ],
  },
  skill: { endpoint: "skills", fields: bilingual("name", "skill_name", { requiredAr: true }) },
  course: {
    endpoint: "courses",
    fields: [...bilingual("name", "course_name", { requiredAr: true }), ...bilingual("date", "date")],
  },
  project: {
    endpoint: "projects",
    fields: [
      ...bilingual("title", "title", { requiredAr: true }),
      ...bilingual("desc", "desc", { type: "textarea" }),
      { name: "techs", labelKey: "techs", type: "tags", ltr: true },
      { name: "url", labelKey: "url", type: "url", ltr: true },
      { name: "repo", labelKey: "repo", type: "url", ltr: true },
      { name: "image", labelKey: "image", type: "file" },
    ],
  },
};
