# Portfolio: Django + React

A bilingual (Arabic RTL / English LTR) personal portfolio with an on-page admin.

| | |
|---|---|
| **Frontend** | TypeScript, React, Vite, Tailwind CSS, Ant Design, Axios, i18next, ESLint, Vitest |
| **Backend** | Django, Django REST Framework, drf-spectacular, pytest |
| **Ops** | Docker Compose (Postgres + gunicorn + nginx), GitHub Actions |

```
portfolio/
├── backend/            Django REST API           -> docs/backend.md
├── frontend/           React + TypeScript app    -> docs/frontend.md
├── docs/               architecture, API, testing, deployment
├── docker-compose.yml  db + backend + frontend (+ adminer with --profile tools)
└── .github/workflows/  CI
```

## Quick start (Docker)

```bash
cp .env.example .env                 # set the secrets and admin password
docker compose up -d --build
```

Open http://localhost:8080. Sign in with the lock icon (credentials from `.env`). Once signed in you get edit/add/delete controls, a **Settings** editor, and a **Links** panel with the service URLs and database details.

- Django admin (also where contact messages land): http://localhost:8080/admin/
- API docs (sign in at `/admin/` first): http://localhost:8080/api/docs/
- Database UI: `docker compose --profile tools up -d`, then http://localhost:8081 (this machine only)

## Develop without Docker

```bash
# backend (terminal 1)
cd backend && python -m venv .venv && .venv\Scripts\activate
pip install -r requirements-dev.txt
copy .env.example .env
python manage.py migrate && python manage.py createsuperuser && python manage.py runserver

# frontend (terminal 2)
cd frontend && npm install && npm run dev      # http://localhost:5173, proxies /api to Django
```

## Quality checks

```bash
cd backend  && pytest --cov=portfolio
cd frontend && npm run lint && npm run typecheck && npm test && npm run build
```

## Bring over data from the old PHP site

Save the JSON from the old `api.php?action=getAllData`, then:
`python manage.py import_legacy old.json` (in Docker: copy the file into the container first).

## Publish to Docker Hub (private repo)

See [docs/deployment.md](docs/deployment.md#publishing-images-to-docker-hub-private). Create the repo as **Private** first, because pushing to a missing name creates a public one.
