from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser

# API docs are for the owner only: sign in at /admin/ first, then open /api/docs/.
_docs = {"authentication_classes": [SessionAuthentication], "permission_classes": [IsAdminUser]}

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(**_docs), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema", **_docs), name="docs"),
    path("api/", include("portfolio.urls")),
]
# In Docker, nginx serves /media/ straight from the shared volume. In dev, or where there is no
# such nginx (SERVE_MEDIA=1, e.g. Render), Django serves the uploads itself.
if settings.SERVE_MEDIA:
    urlpatterns += [re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT})]
