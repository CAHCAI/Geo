from datetime import timezone
from sqlite3 import IntegrityError
from django.http import JsonResponse
import uuid
from django.utils import timezone
from .models import VisitorTracking
#from .auth import validate_api_key

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