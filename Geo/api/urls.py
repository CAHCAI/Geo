from django.urls import path, include
from ninja import NinjaAPI
from .views import admin_login, admin_logout, protected_view, message_view, generate_api_key, validate_api_key, revoke_api_key

from .routers import router
from .auth import APIKeyAuth
from django.http import JsonResponse

# Create the NinjaAPI instance with APIKeyAuth
api = NinjaAPI(auth=APIKeyAuth())
api.add_router("/", router)

# Properly include API URLs
urlpatterns = [
    path("", api.urls),  #  This registers all API routes
    path("login/", admin_login, name="admin_login"),  # Login API
    path("logout/", admin_logout, name="admin_logout"),  # Logout API
    path("protected-view/", protected_view, name="protected_view"),
    path("message/", message_view, name="message"),  # Ensure this is defined
]

#def hello_world(request):
    #return JsonResponse({"message": "Hello from Django!"})

urlpatterns = [
    path("login/", admin_login, name="admin_login"),
    path("logout/", admin_logout, name="admin_logout"),
    path("protected-view/", protected_view, name="protected_view"),
    path("message/", message_view, name="message"),
    path("generate-api-key/", generate_api_key, name="generate_api-key"),
    path("validate-api-key/", validate_api_key, name="validate-api-key"),
    path("revoke-api-key/", revoke_api_key, name="revoke-api-key"),
   # path("hello/", hello_world, name="hello_world"),
    path("", api.urls),  # Catch-all NinjaAPI routes at the end
]
