# auth documentation: https://django-ninja.dev/guides/authentication/

from xxlimited import Str
from ninja import Router, NinjaAPI, Form
from ninja.security import APIKeyHeader
from .models import APIKey
from django.http import JsonResponse


# Authentication API Key
class APIKeyAuth(APIKeyHeader):
    # Direct from the docs:
    # Note: param_name is the name of the GET parameter that will be checked for. If not set, the default of "key" will be used.
    param_name = "X-API-Key"

    def authenticate(self, request, key):
        if key == "supersecret":
            return key
        
def api_key_required(view_func):
    def wrapper(request, *args, **kwargs):
        api_key = request.headers.get("X-API-KEY")  # API key must be sent in headers
        if not api_key or not APIKey.objects.filter(key=api_key).exists():
            return JsonResponse({"error": "Unauthorized"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

    
    

