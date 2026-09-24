# Deployment

## Run everything with Docker

```bash
cp .env.example .env         # set DJANGO_SECRET_KEY, POSTGRES_PASSWORD, admin credentials
docker compose up -d --build
```

Site: http://localhost:8080 · Django admin: `/admin/` · API docs (after signing in at `/admin/`): `/api/docs/`

| Service | Image | Notes |
|---|---|---|
| `db` | postgres:16-alpine | data in the `pgdata` volume, health-checked |
| `backend` | built from `backend/` | gunicorn, migrates + collects static on start |
| `frontend` | built from `frontend/` | nginx: static app, proxies `/api /admin /static`, serves `/media` |
| `adminer` | adminer:4 | profile `tools`, `127.0.0.1:8081` only |

Volumes: `pgdata` (database) and `media` (uploaded images) survive `docker compose down`; `down -v` deletes them.

Start the database UI: `docker compose --profile tools up -d`, then sign in with system PostgreSQL, server `db`, and the values from `.env`. Do not run this profile on a public server.

## Environment (`.env`)

See `.env.example` for all variables. The important ones: `DJANGO_SECRET_KEY`, `POSTGRES_PASSWORD`, `DJANGO_SUPERUSER_*` (first-boot admin), `DJANGO_ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` (set to your domain), `WEB_PORT`, `CONTACT_EMAIL` + `EMAIL_*` (optional contact emails), `DOCKER_REPO`.

## Publishing images to Docker Hub (private)

Docker Hub creates a **public** repository automatically if you push to a name that doesn't exist, so create it first.

1. hub.docker.com → **Repositories → Create repository** → name `portfolio` → visibility **Private**. (One private repo fits both images as tags `:backend` and `:frontend`.)
2. `docker login`
3. Set `DOCKER_REPO=<username>/portfolio` in `.env`, then:
   ```bash
   docker compose build
   docker compose push
   ```
4. On a server: `docker login`, copy `docker-compose.yml` and `.env`, then `docker compose pull && docker compose up -d`.

The images contain no secrets (configuration is injected at run time).

## Going live checklist

- [ ] Strong values for every secret in `.env`; remove the sample admin password.
- [ ] `DJANGO_ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` set to your real domain (`https://...`).
- [ ] HTTPS in front of nginx (Caddy, Cloudflare, or a managed load balancer). The backend already trusts `X-Forwarded-Proto`.
- [ ] Don't run the `tools` profile publicly.
- [ ] Backups: a scheduled `pg_dump` and a copy of the `media` volume.
- [ ] Optional: SMTP settings so contact messages reach your inbox; Sentry for error tracking.
- [ ] Add X/LinkedIn/GitHub links and a real screenshot per project via the on-site admin.
