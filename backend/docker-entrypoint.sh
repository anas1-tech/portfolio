#!/bin/sh
set -e

# Named volumes are created root-owned. Fix that, then re-run this script as the unprivileged user.
if [ "$(id -u)" = "0" ]; then
  chown app:app "$MEDIA_ROOT" 2>/dev/null || true
  exec setpriv --reuid=app --regid=app --init-groups "$0" "$@"
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Create the admin user on first boot if credentials were provided
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput --email "${DJANGO_SUPERUSER_EMAIL:-admin@example.com}" || true
fi

exec "$@"
