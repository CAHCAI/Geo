# auth documentation: https://django-ninja.dev/guides/authentication/
import os
from ninja.security import APIKeyHeader
from .models import APIKey
from django.http import JsonResponse
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django.conf import settings
from functools import wraps 


# Read the fixed API key from the .env 
FIXED_API_KEY = os.getenv("VITE_API_KEY", "")

# Class-based API Key Authentication
class APIKeyAuth(APIKeyHeader):
    param_name = "X-API-Key"

    def authenticate(self, request, key):
        # If the key equals the fixed API key, allow it.
        if key == FIXED_API_KEY:
            return key
        try:
            # Otherwise, look for a dynamic key (if any)
            for key_obj in APIKey.objects.filter(revoked=False):
                if check_password(key, key_obj.key):
                    if key_obj.expires_at and key_obj.expires_at < timezone.now():
                        return None
                    key_obj.increment_usage()
                    return key
            return None
        except APIKey.DoesNotExist:
            return None

# Decorator for API key validation
def api_key_required(view_func):
    @wraps(view_func)  # ← This fixes the issue!
    def wrapper(request, *args, **kwargs):
        provided_key = request.headers.get("X-API-Key")
        if not provided_key:
            return JsonResponse({"error": "API key missing"}, status=401)

        if provided_key == settings.FIXED_API_KEY:
            return view_func(request, *args, **kwargs)

        valid_key = None
        for key_obj in APIKey.objects.filter(revoked=False):
            if check_password(provided_key, key_obj.key):
                valid_key = key_obj
                break

        if not valid_key:
            return JsonResponse({"error": "Invalid API key"}, status=403)

        if valid_key.expires_at and valid_key.expires_at < timezone.now():
            return JsonResponse({"error": "API key expired"}, status=403)

        valid_key.increment_usage()
        return view_func(request, *args, **kwargs)

    return wrapper
