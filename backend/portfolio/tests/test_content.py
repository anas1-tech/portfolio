import io

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from portfolio.models import Project, SiteSettings

pytestmark = pytest.mark.django_db


def png_bytes():
    buf = io.BytesIO()
    Image.new("RGB", (8, 8), "red").save(buf, "PNG")
    return buf.getvalue()


def test_public_can_read_everything_in_one_request(api_client):
    res = api_client.get("/api/portfolio/")
    assert res.status_code == 200
    assert set(res.data) == {"settings", "experiences", "skills", "courses", "projects"}


@pytest.mark.parametrize("path", ["/api/skills/", "/api/courses/", "/api/experiences/", "/api/projects/"])
def test_anonymous_cannot_create(api_client, path):
    assert api_client.post(path, {}, format="json").status_code == 401


def test_anonymous_cannot_change_settings(api_client):
    assert api_client.patch("/api/settings/", {"email": "a@b.co"}, format="json").status_code == 401


def test_admin_can_create_update_and_delete(admin_client):
    created = admin_client.post("/api/skills/", {"name_ar": "قيادة", "name_en": "Leadership"}, format="json")
    assert created.status_code == 201
    url = f"/api/skills/{created.data['id']}/"
    assert admin_client.patch(url, {"name_en": "Lead"}, format="json").data["name_en"] == "Lead"
    assert admin_client.delete(url).status_code == 204


def test_experience_type_is_validated(admin_client):
    res = admin_client.post("/api/experiences/", {"title_ar": "x", "type": "bogus"}, format="json")
    assert res.status_code == 400


def test_settings_singleton_is_updated_in_place(admin_client):
    assert admin_client.patch("/api/settings/", {"github": "https://github.com/x"}, format="json").status_code == 200
    admin_client.patch("/api/settings/", {"email": "me@example.com"}, format="json")
    assert SiteSettings.objects.count() == 1
    assert SiteSettings.load().github == "https://github.com/x"


def test_project_techs_accept_a_json_list(admin_client):
    res = admin_client.post("/api/projects/", {"title_ar": "p", "techs": ["React", " Django "]}, format="json")
    assert res.data["techs"] == ["React", "Django"]


def test_project_techs_accept_a_comma_string_from_multipart(admin_client):
    res = admin_client.post("/api/projects/", {"title_ar": "p", "techs": "React, Django ,"})
    assert res.data["techs"] == ["React", "Django"]
    assert Project.objects.get().techs == ["React", "Django"]


def test_project_image_upload_is_stored_and_served_by_url(admin_client, settings, tmp_path):
    settings.MEDIA_ROOT = tmp_path
    image = SimpleUploadedFile("shot.png", png_bytes(), content_type="image/png")
    res = admin_client.post("/api/projects/", {"title_ar": "p", "image": image})
    assert res.status_code == 201
    assert res.data["image"].endswith(".png")
    assert list((tmp_path / "projects").iterdir())


def test_project_rejects_a_non_image_upload(admin_client, settings, tmp_path):
    settings.MEDIA_ROOT = tmp_path
    bad = SimpleUploadedFile("evil.png", b"not an image", content_type="image/png")
    assert admin_client.post("/api/projects/", {"title_ar": "p", "image": bad}).status_code == 400
