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
| `backup` | postgres:16-alpine | periodic `pg_dump`, dumps in the `db_backups` volume |
| `caddy` | caddy:2-alpine | profile `proxy`, optional TLS-terminating reverse proxy |

Volumes: `pgdata` (database), `media` (uploaded images) and `db_backups` (database dumps) survive `docker compose down`; `down -v` deletes them.

Start the database UI: `docker compose --profile tools up -d`, then sign in with system PostgreSQL, server `db`, and the values from `.env`. Do not run this profile on a public server.

## Environment (`.env`)

See `.env.example` for all variables. The important ones: `DJANGO_SECRET_KEY`, `POSTGRES_PASSWORD`, `DJANGO_SUPERUSER_*` (first-boot admin), `DJANGO_ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` (set to your domain), `WEB_PORT`, `CONTACT_EMAIL` + `EMAIL_*` (optional contact emails), `DOCKER_REPO`, `BACKUP_RETENTION_DAYS` + `BACKUP_INTERVAL_SECONDS` (database backups), `DOMAIN` + `ACME_EMAIL` (optional HTTPS reverse proxy).

## Backups

The `backup` service runs alongside `db` (started automatically, no extra profile needed) and loops forever: every `BACKUP_INTERVAL_SECONDS` (default a day) it takes a `pg_dump --format=custom` of the database into the `db_backups` volume, named `<database>_<UTC timestamp>.dump`, then deletes dumps older than `BACKUP_RETENTION_DAYS` (default 14).

List available dumps:

```bash
docker compose exec backup ls /backups
```

Restore a dump (the dump files live in the `backup` service's `/backups` volume, not on the `db` container, so run `pg_restore` from `backup` against `db` over the network):

```bash
docker compose exec backup sh -c \
  "pg_restore -h db -U \$PGUSER -d \$PGDATABASE --clean --if-exists /backups/<file>.dump"
```

This drops and recreates conflicting objects (`--clean --if-exists`) before restoring, so it's safe to run against a database that already has the old schema/data in it. `PGUSER`, `PGDATABASE` and `PGPASSWORD` are already set in the `backup` service's environment (from `.env`), so `pg_restore` picks them up without extra flags.

To copy a dump off the server (e.g. to keep an off-site copy), use `docker compose cp backup:/backups/<file>.dump ./`.

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

## Deploy on Render (free)

`render.yaml` at the repo root is a Render Blueprint: a Postgres database, the Django API (Docker) and the React site (static site). The site passes `/api`, `/admin`, `/static` and `/media` through to the API, so both live at one address.

1. Push the repo to GitHub.
2. In Render: **New → Blueprint**, pick the repo. Render asks for `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_PASSWORD` and `DJANGO_SUPERUSER_EMAIL` (your admin login).
3. Wait for the three resources to deploy. On first start the API creates the admin user and fills the empty database from `backend/seed/content.json`.
4. Open `https://anas-portfolio.onrender.com`.

Things to know about the free plans:
- The API sleeps after 15 minutes without traffic and takes about a minute to wake. Visitors don't notice: the page shows its built-in content (`frontend/src/content/fallback.json`) until the API answers.
- **The free database is deleted after 30 days.** Upgrade it in the Render dashboard before then to keep anything you edited through the admin.
- Uploaded project images are stored on the API's disk, which is wiped on every deploy. For permanent uploads, add a Render disk (paid) mounted at `/media`, or use object storage.
- If a service name was taken and Render gave it a different URL, update the rewrite destinations and the `*_ORIGINS` / `VITE_SITE_URL` values in `render.yaml`.
- `backend/seed/content.json` must stay identical to `frontend/src/content/fallback.json` (a frontend test checks this).

## Going live checklist

- [ ] Strong values for every secret in `.env`; remove the sample admin password.
- [ ] `DJANGO_ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` set to your real domain (`https://...`).
- [ ] HTTPS: point `DOMAIN` at this server's IP, then set `DOMAIN`, `ACME_EMAIL` and `SECURE_SSL_REDIRECT=1` in `.env` (the `backend` service passes `SECURE_SSL_REDIRECT` through to Django; for a non-Docker deployment set it in `backend/.env` instead), and run `docker compose --profile proxy up -d --build` to bring up the Caddy reverse proxy with automatic Let's Encrypt certs. (A different TLS terminator — Cloudflare, a managed load balancer — works too; the backend already trusts `X-Forwarded-Proto` either way.)
- [ ] Don't run the `tools` profile publicly.
- [ ] Backups: the `backup` service (see [Backups](#backups) above) covers the database automatically; also keep a copy of the `media` volume.
- [ ] Optional: SMTP settings so contact messages reach your inbox; Sentry for error tracking.
- [ ] Add X/LinkedIn/GitHub links and a real screenshot per project via the on-site admin.
