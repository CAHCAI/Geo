from django.urls import path
from ninja import NinjaAPI
from .routers import router

api = NinjaAPI()

# Add the router correctly
api.add_router("", router)  # Remove extra "/api/"

# Properly include API URLs
urlpatterns = [
    path("api/", api.urls),  # Fix the path to properly register NinjaAPI
]
