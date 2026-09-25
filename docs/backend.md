# Backend

Django · Django REST Framework · drf-spectacular · pytest

## Layout

```
backend/
├── manage.py  pytest.ini  Dockerfile  docker-entrypoint.sh
├── requirements.txt          runtime dependencies (what the image installs)
├── requirements-dev.txt      + pytest, pytest-django, pytest-cov
├── config/                   settings.py, urls.py, wsgi.py
└── portfolio/                the only app
    ├── models.py             SiteSettings, Experience, Skill, Course, Project, ContactMessage
    ├── serializers.py        DRF serializers (TagListField accepts a list or "a, b, c")
    ├── views.py              viewsets + portfolio / contact / auth / system views
    ├── permissions.py        IsAdminOrReadOnly
    ├── urls.py               router + explicit paths
    ├── admin.py              Django admin registrations
    ├── migrations/
    ├── management/commands/import_legacy.py
    └── tests/                conftest.py + test_*.py
```

## Permissions

- `IsAdminOrReadOnly` (default): anyone may read; writes require an authenticated **staff** user.
- Login (`/api/auth/login/`) accepts only staff accounts and is throttled to 10/min.
- Contact (`/api/contact/`) is public, throttled to 5/hour per client, and has a honeypot field `website` (filled = silently dropped).
- `/api/system/` is staff-only and never returns the DB password.
- `/api/docs/` and `/api/schema/` (OpenAPI/Swagger) are staff-only via **session** auth: sign in at `/admin/` first.

## Settings (environment variables)

| Variable | Purpose | Default |
|---|---|---|
| `DJANGO_SECRET_KEY` | signing key | insecure dev key (set it!) |
| `DJANGO_DEBUG` | `1` / `0` | `1` |
| `DJANGO_ALLOWED_HOSTS` | comma list | `localhost,127.0.0.1` |
| `CSRF_TRUSTED_ORIGINS` | comma list of origins | empty |
| `CORS_ALLOWED_ORIGINS` | only if the frontend is on another origin | `http://localhost:5173` |
| `POSTGRES_DB/USER/PASSWORD/HOST/PORT` | switches to PostgreSQL when `POSTGRES_DB` is set | SQLite file |
| `MEDIA_ROOT` | where uploads are stored | `backend/media` |
| `CONTACT_EMAIL` | also email contact messages here | off (messages are always saved) |
| `EMAIL_HOST/PORT/HOST_USER/HOST_PASSWORD` | SMTP for that email | console backend |
| `SECURE_SSL_REDIRECT` | `1`/`true`/`yes` to require HTTPS (redirect + secure cookies + HSTS) | off |
| `SECURE_HSTS_SECONDS` | HSTS max-age once `SECURE_SSL_REDIRECT` is on | 30 days when on, `0` when off |

## Management commands

- `python manage.py import_legacy old.json`: imports content exported from the old PHP site (`getAllData` JSON). Ignores unknown columns, turns nulls into empty strings, keeps the original order.
- In Docker the entrypoint runs `migrate` and `collectstatic`, and creates the superuser from `DJANGO_SUPERUSER_*` on first boot. It starts as root only to fix volume ownership, then drops to an unprivileged user.

## Notes

- Django is unpinned upward in `requirements.txt`, so a fresh install gets the latest release. Recent versions deprecate the `EMAIL_*` settings in favor of `MAILERS`; this shows up as warnings, not errors.
- Uploaded images are validated by Pillow (non-images are rejected with 400).
