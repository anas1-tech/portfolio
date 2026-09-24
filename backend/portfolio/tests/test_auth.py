import pytest

from .conftest import PASSWORD

pytestmark = pytest.mark.django_db


def login(client, username, password=PASSWORD):
    return client.post("/api/auth/login/", {"username": username, "password": password}, format="json")


def test_staff_can_log_in_and_gets_a_token(api_client, staff_user):
    res = login(api_client, "owner")
    assert res.status_code == 200
    assert res.data["token"]


def test_wrong_password_is_rejected(api_client, staff_user):
    assert login(api_client, "owner", "nope").status_code == 400


def test_non_staff_account_cannot_log_in(api_client, plain_user):
    assert login(api_client, "visitor").status_code == 400


def test_login_is_rate_limited(api_client, staff_user):
    codes = [login(api_client, "owner", "bad").status_code for _ in range(12)]
    assert codes[:10] == [400] * 10
    assert 429 in codes[10:]


def test_me_reports_admin_status(api_client, admin_client):
    assert admin_client.get("/api/auth/me/").data == {"is_admin": True}


def test_me_for_anonymous_is_not_admin(api_client):
    assert api_client.get("/api/auth/me/").data == {"is_admin": False}


def test_logout_invalidates_the_token(admin_client):
    assert admin_client.post("/api/auth/logout/").status_code == 204
    assert admin_client.post("/api/skills/", {"name_ar": "x"}, format="json").status_code == 401
