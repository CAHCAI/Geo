from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
import json
import secrets
from django.contrib.gis.geos import Point
from datetime import timedelta, datetime
from django.utils import timezone
from .models import AssemblyDistrict, SenateDistrict, CongressionalDistrict, HealthServiceArea, APIKey
from .auth import api_key_required
import openpyxl
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

# Create your views here.
def index(request):
    return render(request,'frontend.html'),

# Admin login from the frontend.
@csrf_exempt  # Disables CSRF protection for API calls (needed for frontend requests).
def admin_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)  # Get data from the frontend request.
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)  # Check if the user exists.

        if user is not None:
            login(request, user)  # Log the admin in.
            return JsonResponse({"message": "Login successful"}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({"error": "Invalid request"}, status=400)

# This function logs out the admin.
@csrf_exempt
def admin_logout(request):
    logout(request)  # Logs the user out.
    return JsonResponse({"message": "Logged out successfully"}, status=200)


@csrf_exempt
@api_key_required
def protected_view(request):
    return JsonResponse({"message": "Authorized access"}, status=200)

def create_api_key(request):
    client_ip = request.META.get("REMOTE_ADDR")  # Get the client's IP address
    api_key = APIKey.objects.create(ip_address=client_ip)
    return JsonResponse({"api_key": api_key.key, "ip_address": client_ip})

def message_view(request):
    return JsonResponse({"message": "Hello from Django API!"})


@api_view(["POST"])
def generate_api_key(request):
    # Get app name from request
    app_name = request.data.get("app_name")  

    if not app_name: 
        return Response({"error": "App name is required"}, status=400)  
    
    # Generate a secure random key
    raw_key = secrets.token_hex(64)
    
    # Log the raw key to confirm it's generated correctly
    print(f"Generated raw key: {raw_key}")
    
    # Hash the key before saving to DB
    hashed_key = raw_key
    
    # Set expiration time to 30 days from now (timezone-aware)
    expiration_time = timezone.make_aware(datetime.now() + timedelta(days=30))
    
    # Save the hashed key
    api_key = APIKey.objects.create(key=hashed_key, expires_at=expiration_time, app_name=app_name)
    
    return Response({
        "api_key": raw_key,  # Show raw key only once
        "app_name": app_name,
        "expires_at": expiration_time.strftime('%Y-%m-%d %I:%M %p')  # Format the expiration time
    })



@api_view(["POST"])
def validate_api_key(request):
    key = request.data.get("api_key")  # Get the raw API key from the request

    if not key:
        return Response({"error": "API key is required"}, status=400)

    # Iterate over all non-revoked API keys and check if any match the provided key.
    valid_key = None
    for k in APIKey.objects.filter(revoked=False):
        if key == k.key:
            valid_key = k
            break

    if not valid_key:
        return Response({"error": "Invalid API key"}, status=403)

    # Check if the API key has expired
    if valid_key.expires_at and valid_key.expires_at < timezone.now():
        return Response({"error": "API key has expired"}, status=403)

    # Increment usage count if needed
    valid_key.increment_usage()
    return Response({"message": "API key valid", "usage_count": valid_key.usage_count})



@api_view(["POST"])
def revoke_api_key(request):
    key = request.data.get("api_key")
    
    # Iterate over all non-revoked API keys and find a match
    valid_key = None
    for k in APIKey.objects.filter(revoked=False):
        if key == k.key:
            valid_key = k
            break

    if not valid_key:
        return Response({"error": "API key not found or invalid"}, status=404)

    valid_key.revoke()
    return Response({"message": "API key revoked"})

'''
@api_view(["GET"])
@api_key_required
def list_api_keys(request):
    keys = APIKey.objects.filter(revoked=False).order_by('-created_at')
    serializer = APIKeySerializer(keys, many=True)
    return Response(serializer.data)
'''