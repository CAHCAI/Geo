from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.gis.geos import Point
from .models import AssemblyDistrict, SenateDistrict, CongressionalDistrict, APIKey
from .auth import api_key_required
import openpyxl
from rest_framework import viewsets, status
from rest_framework.decorators import action
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

def coordinate_search(request):
    # This new view handles your point-in-polygon search.
    lat = request.GET.get('lat')
    lng = request.GET.get('lng')

    # Validate we got lat/lng
    if not lat or not lng:
        return JsonResponse({"error": "Missing lat or lng"}, status=400)

    try:
        lat = float(lat)
        lng = float(lng)
    except ValueError:
        return JsonResponse({"error": "Invalid lat or lng"}, status=400)

    point = Point(lng, lat, srid=4326)

 # Query each district table to see if the point is contained
    senate_matches = SenateDistrict.objects.filter(geom__contains=point)
    assembly_matches = AssemblyDistrict.objects.filter(geom__contains=point)
    congressional_matches = CongressionalDistrict.objects.filter(geom__contains=point)

    # Format results (pick whichever fields you want to send back)
    def to_dict(d):
        return {
            "district_number": d.district_number,
            "district_label": d.district_label,
            "population": d.population,
            # etc.
        }

    results = {
        "senate": [to_dict(d) for d in senate_matches],
        "assembly": [to_dict(d) for d in assembly_matches],
        "congressional": [to_dict(d) for d in congressional_matches],
    }

    return JsonResponse(results, safe=False)

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

