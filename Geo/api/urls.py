from django.urls import path
from ninja import NinjaAPI
from.views import admin_login, admin_logout
from .routers import router

api = NinjaAPI()

# Add the router correctly
api.add_router("/", router)

# Properly include API URLs
urlpatterns = [
    path("", api.urls),  #  This correctly registers all API routes
    path("login/", admin_login, name="admin_login"),  # Login API
    path("logout/", admin_logout, name="admin_logout"),  # Logout API
]