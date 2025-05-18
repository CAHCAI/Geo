from datetime import timezone
from sqlite3 import IntegrityError
from django.http import JsonResponse
import uuid
from django.utils import timezone
from .models import VisitorTracking
#from .auth import validate_api_key
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.conf import settings
from django.utils.module_loading import import_string
from django_ratelimit import ALL as RL_ALL          # constant, not a string
from django_ratelimit.core import get_usage

class GlobalRateLimitMiddleware(MiddlewareMixin):
    """
    Applies a single global rate-limit to every request (including Ninja routes).
    """
    def process_view(self, request, view_func, view_args, view_kwargs):
        # get cfg from settings.py 
        cfg = getattr(settings, "RATE_LIMIT_DEFAULTS", {})

        # parse config
        key    = cfg.get("key", "ip")
        rate   = cfg.get("rate", "10/m")
        method = cfg.get("method", RL_ALL)
        block  = cfg.get("block", True)

        # dotted-path key?
        if isinstance(key, str) and "." in key:
            key = import_string(key)

        # allow human-readable "ALL"
        if isinstance(method, str) and method.upper() == "ALL":
            method = RL_ALL

        # get current request usage
        usage = get_usage(
            request,
            group="global",    
            fn=view_func,           
            key=key,
            rate=rate,
            method=method,
            increment=True         
        )

        # When rate-limiting is disabled or mis-configured, usage is None.
        if usage and usage["should_limit"] and block:
            return JsonResponse(
                {"detail": "Rate limit exceeded."},
                status=429
            )

        return None


class APIKeyMiddleware:
    """Middleware to enforce API key authentication."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        api_key = request.headers.get("X-API-KEY")
        #or not validate_api_key(api_key)
        if not api_key:
            return JsonResponse({"error": "Unauthorized"}, status=401)

        return self.get_response(request)

COOKIE_NAME = "visitor_id"

class VisitorTrackingMiddleware:
    """
    Middleware that ensures every visitor has a unique cookie (visitor_id).
    Updates or creates a VisitorTracking record with the last_seen time
    and whether they're staff (if authenticated).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)  # let the view handle it

        # Check if the user already has a visitor_id cookie
        visitor_id = request.COOKIES.get(COOKIE_NAME)

        # If no cookie, generate a new one
        if not visitor_id:
            visitor_id = str(uuid.uuid4())

        # Determine if user is staff
        is_staff_flag = False
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            if user.is_staff or user.is_superuser:
                is_staff_flag = True

        # Update (or create) the record
        obj, created = VisitorTracking.objects.get_or_create(visitor_id=visitor_id)
        # If this request is from a staff user, override the staff flag
        obj.is_staff = is_staff_flag
        obj.last_seen = timezone.now()
        obj.save()

        # If we had to generate a new visitor_id, set it in the response cookie
        if not request.COOKIES.get(COOKIE_NAME):
            # We generate a new visitor_id
            visitor_id = str(uuid.uuid4())
            response.set_cookie(COOKIE_NAME, visitor_id)
        else:
            visitor_id = request.COOKIES[COOKIE_NAME]
            
        return response