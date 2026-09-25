#!/bin/sh
set -e

# Periodic pg_dump loop. Runs in the `backup` service (see docker-compose.yml):
# dump the database, prune dumps older than BACKUP_RETENTION_DAYS, sleep, repeat.
while true; do
  DUMP_FILE="/backups/${PGDATABASE}_$(date +%Y%m%dT%H%M%S).dump"
  echo "Backing up ${PGDATABASE} to ${DUMP_FILE}"
  pg_dump --format=custom --file="$DUMP_FILE"

  find /backups -name '*.dump' -mtime "+${BACKUP_RETENTION_DAYS}" -delete

  sleep "${BACKUP_INTERVAL_SECONDS}"
done
