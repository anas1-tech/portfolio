# Architecture

```
Browser ──► nginx (frontend container, :8080)
              ├─ /            React build (static files, SPA fallback to index.html)
              ├─ /assets/*    hashed JS/CSS, cached for a year
              ├─ /media/*     uploaded images, read from the shared `media` volume
              └─ /api /admin /static  ──► gunicorn + Django (backend container, :8000)
                                             └─► PostgreSQL (db container)
```

The optional `adminer` container (profile `tools`) is a database web UI bound to `127.0.0.1:8081`.

## Request flow

1. The page loads and `PortfolioProvider` calls `GET /api/portfolio/`. One request returns settings, experience, skills, courses and projects, so the first paint needs a single round trip.
2. Every section reads from that context. Bilingual content is stored as `<field>_ar` / `<field>_en`; `useLocalized().pick(item, "title")` picks the right one and falls back to the other language.
3. Signing in (`POST /api/auth/login/`) returns a token. Axios attaches it to later requests. Admin controls then appear and write through the same REST endpoints.

## Key decisions

- **Same-origin API.** nginx (and the Vite proxy in dev) serve `/api` next to the site, so there is no CORS setup and cookies aren't needed.
- **Token auth, staff only.** Reads are public; writes need a staff token (`IsAdminOrReadOnly`). Non-staff accounts cannot log in at all. Login is rate limited.
- **Django admin is kept.** It is the fallback editor and the place to read contact-form messages.
- **Tailwind + Ant Design coexist through CSS layers.** Ant Design's styles live in `@layer antd`, below Tailwind's utilities, so a Tailwind class on an antd component always wins. See `frontend/src/styles/index.css` and `StyleProvider layer` in `app/providers.tsx`.
- **One generic admin form.** `features/admin/schemas.ts` describes each editable entity; `EntityFormModal` renders any of them. Adding a field is a schema change, not new UI code.
- **Admin code is lazy-loaded** so visitors never download it.
- **Secrets are environment variables.** Nothing sensitive is in the repo or images. The DB password is never sent to the browser (the System panel omits it).

## Data model

`SiteSettings` (single row) · `Experience` (`type`: exp/edu) · `Skill` · `Course` · `Project` (`techs` is a JSON list, optional `image`, `url`, `repo`) · `ContactMessage`.
