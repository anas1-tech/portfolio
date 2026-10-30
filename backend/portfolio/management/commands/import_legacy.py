import json

from django.core.management.base import BaseCommand

from portfolio.models import Course, Experience, Project, SiteSettings, Skill


def pick(model, row):
    """Keep only known columns; turn NULLs into empty strings."""
    names = {f.name for f in model._meta.fields} - {"id"}
    return {k: ("" if v is None else v) for k, v in row.items() if k in names}


class Command(BaseCommand):
    help = "Import data from the old site: save api.php?action=getAllData as JSON and pass its path."

    def add_arguments(self, parser):
        parser.add_argument("json_file")
        parser.add_argument(
            "--if-empty",
            action="store_true",
            help="Do nothing if the site already has content (safe to run on every deploy).",
        )

    def handle(self, *args, json_file, if_empty=False, **opts):
        if if_empty and self.has_content():
            self.stdout.write("Content already present; nothing imported.")
            return

        with open(json_file, encoding="utf-8") as f:
            data = json.load(f)

        if data.get("settings"):
            SiteSettings.objects.update_or_create(pk=1, defaults=pick(SiteSettings, data["settings"]))

        for model, key in [(Experience, "experiences"), (Skill, "skills"), (Course, "courses"), (Project, "projects")]:
            for row in sorted(data.get(key, []), key=lambda r: r.get("id", 0)):  # keep original order
                model.objects.create(**pick(model, row))
            self.stdout.write(f"{key}: {len(data.get(key, []))} imported")

    @staticmethod
    def has_content():
        settings = SiteSettings.objects.filter(pk=1).first()
        return bool(settings and (settings.hero_title_ar or settings.hero_title_en)) or any(
            model.objects.exists() for model in (Experience, Skill, Course, Project)
        )
