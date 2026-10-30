# Frontend

TypeScript · React 19 · Vite · Tailwind CSS 4 · Axios · i18next · ESLint · Vitest · Ant Design 5 (admin UI only)

## Folder structure

```
frontend/
├── public/                    static files served as-is (profile photo + WebP versions, CVs, favicon,
│                              boot.js: sets theme + language before first paint)
├── nginx.conf  Dockerfile     production image
├── security-headers.conf      CSP and other headers, included by nginx.conf
├── eslint.config.js           flat ESLint config (typescript-eslint, react-hooks, react-refresh)
├── vite.config.ts             plugins, "@" alias, dev proxy, chunk splitting, Vitest config,
│                              site-meta plugin (fills %SITE_URL%, writes robots.txt + sitemap.xml)
└── src/
    ├── main.tsx               entry: i18n + CSS + <Providers><App/></Providers>
    ├── app/
    │   ├── App.tsx            page composition, scroll reveals, lazy admin layer
    │   └── providers.tsx      Theme -> Auth -> Portfolio
    ├── api/
    │   ├── client.ts          Axios instance, token store, interceptors, error helper
    │   └── endpoints.ts       one typed function per backend endpoint
    ├── types/api.ts           TypeScript types for every API shape
    ├── i18n/
    │   ├── index.ts           i18next setup; keeps <html lang dir> in sync
    │   └── locales/           ar.json, en.json (identical key sets, enforced by a test)
    ├── content/fallback.json  built-in content shown until (or instead of) the API's
    ├── context/               ThemeContext, AuthContext, PortfolioContext
    ├── hooks/                 useLocalized, useReveal, useScrollSpy, useMakkahTime
    ├── lib/                   pure functions: localize, payload, projects (easy to unit test)
    ├── components/
    │   ├── admin/             AdminControls: lazy, antd-free wrappers for the per-item admin buttons
    │   ├── layout/            Navbar, Footer
    │   └── ui/                Section, SocialLinks (shared, feature-agnostic)
    ├── features/              one folder per page section, plus admin
    │   ├── hero/ about/ resume/ skills/ projects/ contact/   (skills also holds the courses list)
    │   └── admin/             AntdScope, AdminLayer, AdminSlots, schemas, EntityFormModal, LoginModal,
    │                          SystemModal, AdminBar, ItemControls
    ├── styles/index.css       Tailwind import, design tokens, reusable @utility classes
    └── test/                  setup, fixtures, renderWithProviders helper
```

Tests sit next to the code they cover (`Foo.tsx` / `Foo.test.tsx`).

## Conventions

- **Imports** use the `@/` alias (`@/hooks/useLocalized`), never long relative paths.
- **Strict TypeScript.** No `any`; API shapes live in `types/api.ts`.
- **Components don't build URLs or call Axios directly.** They call `api.*` from `api/endpoints.ts`.
- **Logic goes in `lib/`** as pure functions when it can (filtering, payload building, localization), and is unit tested there.
- **Type-only imports** use `import type` (enforced by ESLint).
- **Storage access is guarded** with try/catch (`tokenStore`, theme, language), because it can throw in private mode.

## Styling

- Design tokens are CSS variables in `styles/index.css`, switched by `<html data-theme="dark|light">`. They are exposed to Tailwind through `@theme inline`, so you write `bg-bg2`, `text-muted`, `text-accent`, `bg-sand`.
- The look: one ground, one ink, one green accent, and a sand field sampled from the portrait's backdrop (hero photo, courses, contact). Flat colour only: no gradients, glass, shadows at rest, thin rules or small labels above headings. Square-cornered buttons.
- One typeface for both languages, IBM Plex Sans Arabic, self-hosted through `@fontsource` (400/500/700).
- Reusable blocks are `@utility` classes: `container-x`, `h-section`, `btn`, `btn-primary`, `link-grow`, `hero-in`.
- Motion: give section parts `data-reveal` (and `style={{ "--i": n }}` to stagger); `useReveal` fades them up once as they enter. Reduced motion shows everything at once.
- Use **logical** utilities for RTL/LTR safety: `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`, not `ml`/`mr`/`left`/`right`.
- **Ant Design is admin-only.** Visitors never download it. Every admin entry point wraps itself in `features/admin/AntdScope` (theme, RTL, locale), and public sections import `ItemControls`/`AddButton` from `components/admin/AdminControls`, which lazy-load the real ones only for a signed-in admin. Never import `antd` from a public component.
- Order of layers is `theme, base, antd, components, utilities`, so Tailwind classes override antd without `!important`.

## Content and SEO

- `src/content/fallback.json` is shown instantly and stays for visitors while the API is slow, down, or the database is empty. The admin always sees the real database. Keep it in sync with the real content; load it into the database with `python manage.py import_legacy ../frontend/src/content/fallback.json`.
- Set `VITE_SITE_URL` at build time (on Render, `RENDER_EXTERNAL_URL` is used automatically) so the canonical, hreflang, Open Graph and schema tags and the sitemap point at the live site.

## Internationalization

- Interface text: `t("nav.projects")` from `react-i18next`; add keys to **both** `ar.json` and `en.json` (a test fails if they differ).
- Database content: `const { pick } = useLocalized(); pick(project, "title")` reads `title_ar` / `title_en`.
- Switching language calls `i18n.changeLanguage`, which updates `<html lang dir>`, sets `?lang=en` in the URL (the address search engines index for English), and saves the choice.
- Admin form labels come from `admin.fields.*` and are shown as "Title · AR" / "Title · EN".

## Recipes

**Add a new page section**
1. Create `features/<name>/<Name>.tsx` using `<Section id title>`.
2. Add its id to `SECTIONS` in `components/layout/Navbar.tsx` and a `nav.<id>` string to both locale files.
3. Render it in `app/App.tsx`.

**Make a new entity editable**
1. Add the type to `types/api.ts` and a key to `EntityKind`.
2. Add a schema in `features/admin/schemas.ts` (use `bilingual(...)` for AR/EN pairs).
3. Add `admin.entities.<kind>` and the field labels to both locale files.
4. Use `<AddButton kind="..."/>` and `<ItemControls kind="..." item={...}/>` from `@/components/admin/AdminControls` in its section.

**Call a new endpoint**: add a typed function to `api/endpoints.ts`, and the response type to `types/api.ts`.

## Scripts

`npm run dev` · `npm run build` (typecheck + build) · `npm run lint` · `npm run typecheck` · `npm test` · `npm run test:watch`
