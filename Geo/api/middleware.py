from django.http import JsonResponse
from .auth import validate_api_key

class APIKeyMiddleware:
    """Middleware to enforce API key authentication."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        api_key = request.headers.get("X-API-KEY")

        if not api_key or not validate_api_key(api_key):
            return JsonResponse({"error": "Unauthorized"}, status=401)

        return self.get_response(request)
