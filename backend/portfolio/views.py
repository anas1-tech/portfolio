import logging

from django.conf import settings
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.db import connection
from rest_framework import generics, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import ContactMessage, Course, Experience, Project, SiteSettings, Skill
from .serializers import (
    ContactSerializer,
    CourseSerializer,
    ExperienceSerializer,
    ProjectSerializer,
    SiteSettingsSerializer,
    SkillSerializer,
)


logger = logging.getLogger(__name__)


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class SiteSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.load()


@api_view(["GET"])
def portfolio(request):
    """Everything the public page needs, in a single request."""
    ctx = {"request": request}
    return Response(
        {
            "settings": SiteSettingsSerializer(SiteSettings.load()).data,
            "experiences": ExperienceSerializer(Experience.objects.all(), many=True).data,
            "skills": SkillSerializer(Skill.objects.all(), many=True).data,
            "courses": CourseSerializer(Course.objects.all(), many=True).data,
            "projects": ProjectSerializer(Project.objects.all(), many=True, context=ctx).data,
        }
    )


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request):
        user = authenticate(
            username=request.data.get("username", ""),
            password=request.data.get("password", ""),
        )
        if not user or not user.is_staff:
            return Response({"detail": "Invalid credentials."}, status=400)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})


class ContactView(APIView):
    """Public contact form. Stored in the DB and optionally emailed to CONTACT_EMAIL."""

    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def post(self, request):
        # Honeypot: real users never see or fill this field, bots do. Pretend success.
        if request.data.get("website"):
            return Response(status=201)
        serializer = ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        msg = serializer.save()
        if settings.CONTACT_EMAIL:
            try:
                send_mail(
                    f"Portfolio message from {msg.name}",
                    f"{msg.message}\n\nFrom: {msg.name} <{msg.email}>",
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.CONTACT_EMAIL],
                )
            except Exception:
                # The message is already saved; a broken SMTP setup must not fail the visitor's request.
                logger.exception("Could not email contact message %s", msg.pk)
        return Response(status=201)


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=204)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def system(request):
    """Service links and database details for the admin's System panel. Never includes the DB password."""
    site = f"{request.scheme}://{request.get_host()}"
    db = settings.DATABASES["default"]
    is_pg = db["ENGINE"].endswith("postgresql")

    try:
        connection.ensure_connection()
        db_ok = True
    except Exception:
        db_ok = False

    return Response(
        {
            "links": [
                {"key": "site", "url": site + "/"},
                {"key": "api", "url": site + "/api/portfolio/"},
                {"key": "admin", "url": site + "/admin/"},
            ],
            "database": {
                "engine": "PostgreSQL" if is_pg else "SQLite",
                "ok": db_ok,
                "counts": {
                    "projects": Project.objects.count(),
                    "skills": Skill.objects.count(),
                    "courses": Course.objects.count(),
                    "experiences": Experience.objects.count(),
                    "messages": ContactMessage.objects.count(),
                    "unread_messages": ContactMessage.objects.filter(is_read=False).count(),
                },
            },
        }
    )


@api_view(["GET"])
def me(request):
    return Response({"is_admin": bool(request.user.is_authenticated and request.user.is_staff)})
