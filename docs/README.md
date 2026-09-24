# Documentation

| Doc | What's in it |
|---|---|
| [architecture.md](architecture.md) | How the pieces fit together, request flow, key decisions |
| [frontend.md](frontend.md) | React/TypeScript app: folder structure, conventions, i18n, styling, how to add things |
| [backend.md](backend.md) | Django/DRF app: models, permissions, settings, management commands |
| [api.md](api.md) | Endpoint reference |
| [testing.md](testing.md) | pytest and Vitest: how to run, what is covered, how to write tests |
| [deployment.md](deployment.md) | Docker, environment variables, Docker Hub, going live |

## Stack at a glance

| Layer | Tools |
|---|---|
| Frontend | TypeScript, React 19, Vite, Tailwind CSS 4, Ant Design 5, Axios, i18next, ESLint, Vitest + Testing Library |
| Backend | Python, Django, Django REST Framework, drf-spectacular (OpenAPI), pytest + pytest-django |
| Data | PostgreSQL (Docker) / SQLite (local dev) |
| Ops | Docker Compose, nginx, gunicorn, GitHub Actions |

## Common commands

```bash
# everything, in Docker (site on http://localhost:8080)
docker compose up -d --build

# frontend (cd frontend)
npm run dev          # dev server with API proxy
npm run lint         # ESLint
npm run typecheck    # tsc
npm test             # Vitest
npm run build        # typecheck + production build

# backend (cd backend)
pytest               # all tests
pytest --cov=portfolio --cov-report=term-missing
python manage.py runserver
```
