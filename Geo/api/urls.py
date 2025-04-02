from django.urls import path, include
from ninja import NinjaAPI
from .views import admin_login, admin_logout, protected_view, message_view, generate_api_key, validate_api_key, revoke_api_key, list_api_keys
from .routers import router
from .auth import APIKeyAuth
from django.http import JsonResponse


# Ninja API setup with auth
api = NinjaAPI(auth=APIKeyAuth())
api.add_router("/", router)  # All your API routes (like /search, /upload, etc.)

urlpatterns = [
    # Django function-based endpoints
    path("login/", admin_login, name="admin_login"),
    path("logout/", admin_logout, name="admin_logout"),
    path("protected-view/", protected_view, name="protected_view"),
    path("message/", message_view, name="message"),
    path("generate-api-key/", generate_api_key, name="generate-api-key"),
    path("validate-api-key/", validate_api_key, name="validate-api-key"),
    path("revoke-api-key/", revoke_api_key, name="revoke-api-key"),
    path("api/api-keys/", list_api_keys, name="list_api_keys"),

    # NinjaAPI endpoints
    path("", api.urls),
]