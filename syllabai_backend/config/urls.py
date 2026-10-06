"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def api_root(_request):
    """Expose API discovery links; the web app itself runs on the Next.js server."""
    return JsonResponse({
        "service": "SyllabAI API",
        "status": "ok",
        "documentation": "/api/docs/",
        "schema": "/api/schema/",
    })


def empty_favicon(_request):
    """Avoid an irrelevant missing-favicon response on the API host."""
    return HttpResponse(status=204)


urlpatterns = [
    path("", api_root, name="api-root"),
    path("favicon.ico", empty_favicon, name="api-favicon"),
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/learning/", include("apps.learning.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
