import pytest
from django.core import mail

from portfolio.models import ContactMessage

pytestmark = pytest.mark.django_db

VALID = {"name": "Sara", "email": "sara@example.com", "message": "Hello!"}


def test_valid_message_is_saved(api_client):
    assert api_client.post("/api/contact/", VALID, format="json").status_code == 201
    assert ContactMessage.objects.get().email == "sara@example.com"


def test_honeypot_submissions_are_dropped_silently(api_client):
    res = api_client.post("/api/contact/", {**VALID, "website": "http://spam"}, format="json")
    assert res.status_code == 201  # the bot is told it worked
    assert ContactMessage.objects.count() == 0


@pytest.mark.parametrize("bad", [{"email": "nope"}, {"name": ""}, {"message": ""}])
def test_invalid_input_is_rejected(api_client, bad):
    assert api_client.post("/api/contact/", {**VALID, **bad}, format="json").status_code == 400


def test_submissions_are_rate_limited(api_client):
    codes = [api_client.post("/api/contact/", VALID, format="json").status_code for _ in range(7)]
    assert codes[:5] == [201] * 5
    assert 429 in codes[5:]


def test_owner_is_emailed_when_configured(api_client, settings):
    settings.CONTACT_EMAIL = "me@example.com"
    api_client.post("/api/contact/", VALID, format="json")
    assert len(mail.outbox) == 1
    assert mail.outbox[0].to == ["me@example.com"]
    assert "Hello!" in mail.outbox[0].body


def test_smtp_failure_does_not_lose_the_message(api_client, settings, monkeypatch):
    settings.CONTACT_EMAIL = "me@example.com"

    def boom(*args, **kwargs):
        raise ConnectionError("smtp down")

    monkeypatch.setattr("portfolio.views.send_mail", boom)
    assert api_client.post("/api/contact/", VALID, format="json").status_code == 201
    assert ContactMessage.objects.count() == 1


def test_no_email_is_sent_when_not_configured(api_client, settings):
    settings.CONTACT_EMAIL = ""
    api_client.post("/api/contact/", VALID, format="json")
    assert mail.outbox == []
