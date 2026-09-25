import pytest

pytestmark = pytest.mark.django_db


def test_system_info_requires_staff(api_client):
    assert api_client.get("/api/system/").status_code == 401


def test_system_info_lists_links_and_db_without_password(admin_client):
    res = admin_client.get("/api/system/")
    assert res.status_code == 200
    assert res.data["database"]["ok"] is True
    assert {link["key"] for link in res.data["links"]} == {"site", "api", "admin"}
    assert "password" not in str(res.data).lower()


def test_system_counts_reflect_content(admin_client):
    admin_client.post("/api/skills/", {"name_ar": "x"}, format="json")
    assert admin_client.get("/api/system/").data["database"]["counts"]["skills"] == 1


def test_api_docs_are_closed_to_visitors(api_client):
    assert api_client.get("/api/docs/").status_code in (401, 403)
    assert api_client.get("/api/schema/").status_code in (401, 403)


def test_openapi_schema_generates_for_staff(api_client, staff_user):
    api_client.force_authenticate(staff_user)
    res = api_client.get("/api/schema/")
    assert res.status_code == 200
    assert b"/api/portfolio/" in res.content
