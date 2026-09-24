# Frontend

TypeScript · React 19 · Vite · Tailwind CSS 4 · Ant Design 5 · Axios · i18next · ESLint · Vitest

## Folder structure

```
frontend/
├── public/                    static files served as-is (profile photo, CVs)
├── nginx.conf  Dockerfile     production image
├── eslint.config.js           flat ESLint config (typescript-eslint, react-hooks, react-refresh)
├── vite.config.ts             plugins, "@" alias, dev proxy, chunk splitting, Vitest config
└── src/
    ├── main.tsx               entry: i18n + CSS + <Providers><App/></Providers>
    ├── app/
    │   ├── App.tsx            page composition, loading/error states, lazy admin UI
    │   └── providers.tsx      Theme -> Ant Design (theme, RTL, locale) -> Auth -> Portfolio
    ├── api/
    │   ├── client.ts          Axios instance, token store, interceptors, error helper
    │   └── endpoints.ts       one typed function per backend endpoint
    ├── types/api.ts           TypeScript types for every API shape
    ├── i18n/
    │   ├── index.ts           i18next setup; keeps <html lang dir> in sync
    │   └── locales/           ar.json, en.json (identical key sets, enforced by a test)
    ├── context/               ThemeContext, AuthContext, PortfolioContext
    ├── hooks/                 useLocalized, useReveal, useScrollSpy, useTypewriter
    ├── lib/                   pure functions: localize, payload, projects (easy to unit test)
    ├── components/
    │   ├── layout/            Navbar
    │   └── ui/                Reveal, Section, SocialLinks (shared, feature-agnostic)
    ├── features/              one folder per page section, plus admin
    │   ├── hero/ about/ resume/ skills/ courses/ projects/ contact/
    │   └── admin/             schemas, EntityFormModal, LoginModal, SystemModal, AdminBar, ItemControls
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

- Design tokens (colors, gradient, shadows) are CSS variables in `styles/index.css`, switched by `<html data-theme="dark|light">`. They are exposed to Tailwind through `@theme inline`, so you write `bg-surface`, `text-muted`, `border-line`, `text-accent2`.
- Reusable blocks are `@utility` classes: `container-x`, `card`, `glass`, `grad-bg`, `grad-text`, `reveal`.
- Use **logical** utilities for RTL/LTR safety: `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`, not `ml`/`mr`/`left`/`right`.
- Ant Design components are themed in `app/providers.tsx` (`ConfigProvider`): dark/light algorithm, primary color, RTL direction and locale follow the app state.
- Order of layers is `theme, base, antd, components, utilities`, so Tailwind classes override antd without `!important`.

## Internationalization

- Interface text: `t("nav.projects")` from `react-i18next`; add keys to **both** `ar.json` and `en.json` (a test fails if they differ).
- Database content: `const { pick } = useLocalized(); pick(project, "title")` reads `title_ar` / `title_en`.
- Switching language calls `i18n.changeLanguage`, which updates `<html lang dir>`, saves the choice, and re-renders Ant Design with the matching locale and direction.
- Admin form labels come from `admin.fields.*` and are shown as "Title · AR" / "Title · EN".

## Recipes

**Add a new page section**
1. Create `features/<name>/<Name>.tsx` using `<Section id title eyebrow>`.
2. Add its id to `SECTIONS` in `components/layout/Navbar.tsx` and a `nav.<id>` string to both locale files.
3. Render it in `app/App.tsx`.

**Make a new entity editable**
1. Add the type to `types/api.ts` and a key to `EntityKind`.
2. Add a schema in `features/admin/schemas.ts` (use `bilingual(...)` for AR/EN pairs).
3. Add `admin.entities.<kind>` and the field labels to both locale files.
4. Use `<AddButton kind="..."/>` and `<ItemControls kind="..." item={...}/>` in its section.

**Call a new endpoint**: add a typed function to `api/endpoints.ts`, and the response type to `types/api.ts`.

## Scripts

`npm run dev` · `npm run build` (typecheck + build) · `npm run lint` · `npm run typecheck` · `npm test` · `npm run test:watch`
