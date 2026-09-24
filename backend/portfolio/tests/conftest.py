import pytest
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

PASSWORD = "pw-12345-test"


@pytest.fixture(autouse=True)
def _clear_throttle_cache():
    """DRF throttles live in the cache; start every test with a clean slate."""
    cache.clear()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def staff_user(db):
    return User.objects.create_user("owner", password=PASSWORD, is_staff=True)


@pytest.fixture
def plain_user(db):
    return User.objects.create_user("visitor", password=PASSWORD)


@pytest.fixture
def admin_client(api_client, staff_user):
    """An API client authenticated with a staff token, exactly like the React app."""
    token = Token.objects.create(user=staff_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client
