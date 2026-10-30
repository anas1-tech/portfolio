import json

import pytest
from django.core.management import call_command

from portfolio.models import Course, Experience, Project, SiteSettings, Skill

pytestmark = pytest.mark.django_db

LEGACY = {
    "settings": {"id": 1, "hero_title_en": "Anas", "address_ar": None, "unknown_column": "ignored"},
    "experiences": [
        {"id": 2, "type": "exp", "title_ar": "ب"},
        {"id": 1, "type": "edu", "title_ar": "أ"},
    ],
    "skills": [{"id": 1, "name_ar": "x"}],
    "courses": [{"id": 1, "name_ar": "c"}],
    "projects": [{"id": 1, "title_ar": "p", "techs": ["A", "B"], "img_url": "old.png"}],
}


@pytest.fixture
def legacy_file(tmp_path):
    path = tmp_path / "old.json"
    path.write_text(json.dumps(LEGACY, ensure_ascii=False), encoding="utf-8")
    return str(path)


def test_imports_every_table(legacy_file):
    call_command("import_legacy", legacy_file)
    assert (Experience.objects.count(), Skill.objects.count(), Course.objects.count(), Project.objects.count()) == (2, 1, 1, 1)
    assert Project.objects.get().techs == ["A", "B"]


def test_nulls_become_empty_strings_and_unknown_columns_are_ignored(legacy_file):
    call_command("import_legacy", legacy_file)
    s = SiteSettings.load()
    assert s.hero_title_en == "Anas"
    assert s.address_ar == ""


def test_original_order_is_kept_regardless_of_export_order(legacy_file):
    call_command("import_legacy", legacy_file)
    # the export listed id 2 first; id 1 ("edu") must still be created first
    assert list(Experience.objects.order_by("id").values_list("type", flat=True)) == ["edu", "exp"]


def test_if_empty_imports_into_an_empty_site(legacy_file):
    call_command("import_legacy", legacy_file, if_empty=True)
    assert Skill.objects.count() == 1


def test_if_empty_leaves_existing_content_alone(legacy_file):
    Skill.objects.create(name_ar="موجود")
    call_command("import_legacy", legacy_file, if_empty=True)
    assert list(Skill.objects.values_list("name_ar", flat=True)) == ["موجود"]
    assert Experience.objects.count() == 0
