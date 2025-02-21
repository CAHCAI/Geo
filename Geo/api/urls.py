from django.urls import path
from ninja import NinjaAPI
from.views import admin_login, admin_logout
from .routers import router
from .auth import APIKeyAuth
from ninja.security import HttpBearer

# defines a NinjaAPI that is locked behind APIKeyAuth security
api = NinjaAPI(auth=APIKeyAuth())

# Add the router
api.add_router("/", router)

# Properly include API URLs
urlpatterns = [
    path("", api.urls),  #  This registers all API routes
    path("login/", admin_login, name="admin_login"),  # Login API
    path("logout/", admin_logout, name="admin_logout"),  # Logout API
]