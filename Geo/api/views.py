from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

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