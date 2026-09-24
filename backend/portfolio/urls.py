from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("experiences", views.ExperienceViewSet)
router.register("skills", views.SkillViewSet)
router.register("courses", views.CourseViewSet)
router.register("projects", views.ProjectViewSet)

urlpatterns = [
    path("portfolio/", views.portfolio),
    path("settings/", views.SiteSettingsView.as_view()),
    path("contact/", views.ContactView.as_view()),
    path("auth/login/", views.LoginView.as_view()),
    path("auth/logout/", views.LogoutView.as_view()),
    path("auth/me/", views.me),
    path("system/", views.system),
    path("", include(router.urls)),
]
