import datetime
import os
from django.http import JsonResponse
from shutil import rmtree
import sys
import traceback
from .auth import APIKeyAuth, api_key_required
import subprocess
import uuid
import zipfile
from django.contrib.gis.utils import LayerMapping
from .models import AssemblyDistrict  # Adjust the import as needed
from django.conf import settings
from django.http import JsonResponse
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from ninja import Router, File, Schema, Form
from ninja.files import UploadedFile
from tempfile import TemporaryDirectory
from datetime import datetime 
from pydantic import Field  
# utility functions
from .utils import (extract_zip, find_shapefile, get_shapefile_metadata, 
identify_shapefile_type, upload_assembly_shapefile, upload_congressional_shapefile,
upload_laspa_shapefile, upload_senate_shapefile, get_shapefile_layer, to_dict, 
upload_hsa_shapefile, upload_rnsa_shapefile, upload_mssa_shapefile, upload_pcsa_shapefile, handle_csv_upload)
# end utility functions
from django.shortcuts import get_object_or_404
from django.db import connection
from django.contrib.gis.db.models.functions import AsGeoJSON
from .models import AssemblyDistrict, SenateDistrict, AdminErrors, CongressionalDistrict, HealthServiceArea, MedicalServiceStudyArea,RegisteredNurseShortageArea, LAServicePlanningArea, PrimaryCareShortageArea, HealthProfessionalShortageArea, HPSA_PrimaryCareShortageArea,HPSA_MentalHealthShortageArea,HPSA_DentalHealthShortageArea,APIKey
import json
from Geo.cache import cache, TTL
from typing import List, Optional
import openpyxl
from django.db import transaction
from .models import OverrideLocation
from django.contrib.sessions.models import Session
from django.utils import timezone
from django.contrib.auth import get_user_model
from docker import DockerClient
from docker import from_env


# Directory to temporarily store uploaded shapefiles
UPLOAD_DIR = os.path.join(settings.MEDIA_ROOT, "shapefiles")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create a router instance
router = Router()

#router = Router(auth=APIKeyAuth())

@router.get("/test")
def test(request):
    """
    A simple test endpoint to verify the API is working.
    """
    return JsonResponse({"success": True, "message": "test api, successful."})

@router.get("/test-cache")
def test_cache(request):
    """
    A simple test endpoint to verify the API Redis cache is working. The intent is to call it twice:
        1. The first request sets a value in redis because there is currently a cache miss for the cache value
        2. The second request validates the cache hit after the value is set. 
    """
    try:
        if cache.get("my_key"):
            return JsonResponse({"success": True, "message": "test api, successful. Used cache."})
        else:
            cache.set("my_key", 1)
            return JsonResponse({"success": True, "message": "test api, successful. Will use cache next time."})
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(131, f"Redis failed: {str(e)}", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return JsonResponse({"success": False, "message": f"Redis failed: {str(e)}"})

@router.post("/upload-shapefile/")
def upload_shapefile(request, file: UploadedFile = File(...), file_type: str = Form(...)):
    """
    Upload a shapefile (as .zip) and populate the respective model.
    """
    print("handling upload")
    # valid shapefile types for upload, any other files will get invalid filetype
    valid_types = {"assembly", "congressional", "senate", "laspa", "hsa", "rnsa", "mssa", "pcsa", "hpsa"}
    # lowercase the file type
    file_type = file_type.lower()
    if file_type not in valid_types:
        try:
            stack = traceback.extract_stack()
            error_response(503, "Invalid file type specifier.", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return JsonResponse({"success" : False, "message" : "Invalid file type specifier"})
    print("validated file")
    if (file_type == "hpsa"):
        handle_csv_upload(file)
        print("handled csv upload")
        # if upload is successful, flush the cache 
        cache.flushdb()
        return JsonResponse({"success" : True, "message" : "HPSA data uploaded"}, status=200)
    elif (file_type != "hpsa" and file.name.lower().endswith(".csv")):
        try:
            stack = traceback.extract_stack()
            error_response(500, "CSV must be uploaded under Health Provider Shortage Areas (HPSA)", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return JsonResponse({"success" : False, "message" : "CSV must be uploaded under Health Provider Shortage Areas (HPSA)"}, status=500)
    
    
    try:   
        # Extract the zip file
        tmp_dir = extract_zip(file)
    
        # Get the path to the shapefile (.shp)
        shapefile_path = find_shapefile(tmp_dir.name)

        # Check if a shapefile is found
        if not shapefile_path:
            try:
                stack = traceback.extract_stack()
                error_response(501, "No shapefile found in the .zip archive.", stack)
            except Exception as e:
                print(f"Error found but not logged into the database! {e}")
            return {"error": "No shapefile found in the .zip archive."}

        # Get metadata from the shapefile
        fields = get_shapefile_metadata(shapefile_path)
        
        layer = get_shapefile_layer(shapefile_path)
        
        # try to identify the shapefile type
        validated_file_type = identify_shapefile_type(fields)
        
        if file_type != validated_file_type:
            print(f"mismatched filetype | valid: {validated_file_type}, given: {file_type}")
            try:
                stack = traceback.extract_stack()
                error_response(400, "Invalid selected shapefile type.", stack)
            except Exception as e:
                print(f"Error creating error log in table: {e}")
            return JsonResponse({"success": False, "error": "Invalid selected shapefile type."}, status=400)

        # Process the shapefile based on its type
        try:    
            if file_type == "assembly":
                upload_assembly_shapefile(layer)
            elif file_type == "senate":
                upload_senate_shapefile(layer)
            elif file_type == "congressional":
                upload_congressional_shapefile(layer)
            elif file_type == "laspa":
                upload_laspa_shapefile(layer)
            elif file_type == "hsa":
                upload_hsa_shapefile(layer)
            elif file_type == "rnsa":
                upload_rnsa_shapefile(layer)
            elif file_type == "mssa":
                upload_mssa_shapefile(layer)
            elif file_type == "pcsa":
                upload_pcsa_shapefile(layer)
            else:
                try:
                    stack = traceback.extract_stack()
                    error_response(400, "Unknown shapefile type", stack)
                except Exception as e:
                    print(f"Error creating log in the database: {e}")
                return JsonResponse({"success": False, "error": "Unknown shapefile type", "status":400}, status=400)
        except Exception as e:
            print(f"Error uploading shapefile of type {file_type}: {e}")
            try:
                stack = traceback.extract_stack()
                error_response(400, f"Shapefile of type '{file_type}' failed: {e}", stack)
            except Exception as e:
                print(f"Error creating log in the database: {e}")
            return JsonResponse({"success" : False, "message": f"Shapefile of type '{file_type}' failed: {e}"}, status=400)
        # return on success
        return JsonResponse({"success" : True, "message": f"Shapefile of type '{file_type}' uploaded and processed successfully."})
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(400, f"Error response {e}", stack)
        except Exception as e:
            print(f"Error creating log in the database: {e}")
        return JsonResponse({"success": False, "error": f"Error response {e}"}, status=400)
    finally:
        # Cleanup the temporary directory
        if tmp_dir:
            tmp_dir.cleanup()

def process_uploaded_zip(file, expected_filename):
    """
    Saves the uploaded ZIP (ensuring its filename matches the expected value),
    extracts it (even if subfolders are created), and searches recursively for the .shp file.
    
    Returns a tuple (file_path, shp_path) where:
      - file_path is the path where the ZIP file was saved.
      - shp_path is the full path to the found .shp file.
    
    Raises a ValueError if the file is not valid.
    """
    if file.name.lower() != expected_filename.lower():
        try:
            stack = traceback.extract_stack()
            error_response(502, f"Uploaded file must be named {expected_filename}", stack)
        except Exception as e:
            print(f"Error creating log in the database: {e}")
        raise ValueError(f"Uploaded file must be named {expected_filename}")
    
    unique_filename = f"{uuid.uuid4()}_{file.name}"
    upload_dir = os.path.join(settings.MEDIA_ROOT, "shapefiles")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save the file to disk in chunks
    with open(file_path, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    
    # Extract the ZIP file into the upload directory
    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            zf.extractall(upload_dir)
    except zipfile.BadZipFile:
        try:
            stack = traceback.extract_stack()
            error_response(503, "Uploaded file is not a valid zip file.", stack)
        except Exception as e:
            print(f"Error creating log in the database: {e}")
        raise ValueError("Uploaded file is not a valid zip file.")
    
    # Recursively search for a .shp file in the extracted directory
    shp_path = None
    for root, dirs, files in os.walk(upload_dir):
        for name in files:
            if name.lower().endswith('.shp'):
                shp_path = os.path.join(root, name)
                break
        if shp_path:
            break
    if not shp_path:
        try:
            stack = traceback.extract_stack()
            error_response(111, "No shapefile (.shp) found in the extracted archive.", stack)
        except Exception as e:
             print(f"Error found but not logged into the database! {e}")
        raise ValueError("No shapefile (.shp) found in the extracted archive.")
    return file_path, shp_path

#Test 
@router.get("/dev-credentials")
def dev_credentials(request):
   
    return {
        "admin_username": "user",
        "admin_password": "password"
    }


#List all tables in the connected database
@router.get("/list-tables")
def list_tables(request):
    """
    Endpoint to retrieve all table names from the public schema.
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename;
        """)
        table_rows = cursor.fetchall()
    
    # Flatten list of tuples into a list of strings
    tables = [row[0] for row in table_rows]
    return JsonResponse({"tables": tables})

@router.get("/all-districts-data")
def all_districts_data(request):
    """
    Fetches data for all districts, with geometry converted to GeoJSON strings.
    """
    cache_key = "geoJson-all-data"

    # Check if data is already cached
    try:
        cache_value = cache.get(cache_key)
        if cache_value:
            cache_value = json.loads(cache_value)
            cache_value["used_cache"] = True
            return JsonResponse(cache_value, safe=False)
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(100, f"Reading from Cache failed: {str(e)}", stack)
        except Exception as e:
             print(f"Error fetching from cache: {e}")

    # Helper function to clean data handling None values and geom fields
    def clean_data(queryset):
        return [
            {key: value for key, value in item.items() if key != "geom"}  # Exclude 'geom'
            for item in queryset
        ]

    assembly_qs = (
        AssemblyDistrict.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))  # Convert geom to GeoJSON
        .values()  
    )
    assembly_data = clean_data(assembly_qs)


    senate_qs = (
        SenateDistrict.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values()  
    )
    senate_data = clean_data(senate_qs)

    congress_qs = (
        CongressionalDistrict.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values()  
    )
    congress_data = clean_data(congress_qs)

    # Health Service Area with GeoJSON
    hsa_qs = (
        HealthServiceArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values()  # Include all fields
    )
    hsa_data = clean_data(hsa_qs)

    # LA Service Planning Area with GeoJSON
    laspa_qs = (
        LAServicePlanningArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values()  # Include all fields
    )
    laspa_data = clean_data(laspa_qs)

    # Registered Nurse Shortage Area with GeoJSON
    rnsa_qs = (
        RegisteredNurseShortageArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values()  # Include all fields
    )
    rnsa_data = clean_data(rnsa_qs)

    # Medical Service Study Area with GeoJSON
    mssa_qs = (
        MedicalServiceStudyArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values()  # Include all fields
    )
    mssa_data = clean_data(mssa_qs)

    # Primary Care Shortage Area with GeoJSON
    pcsa_qs = (
        PrimaryCareShortageArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values()  # Include all fields
    )
    pcsa_data = clean_data(pcsa_qs)

    # Combine all data into a single dictionary
    cache_value = {
        "assembly_districts": assembly_data,
        "senate_districts": senate_data,
        "congressional_districts": congress_data,
        "health_service_data": hsa_data,
        "la_service_planning": laspa_data,
        "rnsa": rnsa_data,
        "mssa": mssa_data,
        "pcsa": pcsa_data,
    }

    # Cache the result for future requests
    if any(cache_value.values()):
        try:
            cache.set(cache_key, json.dumps(cache_value))
        except Exception as e:
            try:
                stack = traceback.extract_stack()
                error_response(132, f"Error caching data: {str(e)}", stack)
            except Exception as e:
                print(f"Error caching data: {e}")
    return JsonResponse(cache_value, safe=False)

@router.get("/search")
def coordinate_search(request, lat: float, lng: float):
    """
    Search the district tables for polygons containing (lat, lng).
    """
    cache_key = f"{lat}_{lng}"

    try:
        print(f"Coordinate Search Called - lat: {lat}, lng: {lng}")
        cache_value = cache.get(cache_key)
        if cache_value:
            cache_value = json.loads(cache_value)
            cache_value["used_cache"] = True
            return JsonResponse(cache_value, safe=False)

        point = Point(lng, lat, srid=4326)

        senate_matches = SenateDistrict.objects.filter(geom__contains=point)
        assembly_matches = AssemblyDistrict.objects.filter(geom__contains=point)
        congressional_matches = CongressionalDistrict.objects.filter(geom__contains=point)
        healthservicearea_matches = HealthServiceArea.objects.filter(geom__contains=point)
        laserviceplanningarea_matches = LAServicePlanningArea.objects.filter(geom__contains=point)
        registerednurseshortagearea_matches = RegisteredNurseShortageArea.objects.filter(geom__contains=point)
        medicalservicestudyarea_matches = MedicalServiceStudyArea.objects.filter(geom__contains=point)
        primarycareshortagearea_matches = PrimaryCareShortageArea.objects.filter(geom__contains=point)


        primary_matches = []
        mental_matches = []
        dental_matches = []
        censuskey = 0

        if medicalservicestudyarea_matches.exists():
            raw_censuskey = medicalservicestudyarea_matches.first().geoid
            censuskey = raw_censuskey.lstrip("0") if raw_censuskey else None
            print(f"Raw GEOID: {raw_censuskey} | Stripped: {censuskey}")

        if censuskey:
            possible_keys = [raw_censuskey, censuskey, censuskey.zfill(11)]
            print(f"Trying possible keys: {possible_keys}")

            primary_matches = (
            HPSA_PrimaryCareShortageArea.objects.filter(hpsa_geography_id__in=possible_keys)
            .order_by("-hpsa_designation_last_update_date")
            )
            primary_match = primary_matches.first()
            print("Primary Match (Latest):", primary_match)

            mental_matches = (HPSA_MentalHealthShortageArea.objects.filter(
            hpsa_geography_id__in=possible_keys).order_by("-hpsa_designation_last_update_date")
            )
            mental_match = mental_matches.first()
            print("Mental Match (Latest):", mental_match)

            dental_matches = (HPSA_DentalHealthShortageArea.objects.filter(
            hpsa_geography_id__in=possible_keys).order_by("-hpsa_designation_last_update_date")
            )
            dental_match = dental_matches.first()
            print("Dental Match (Latest):", dental_match) 



        
        cache_value = {
            "senate": [to_dict(d) for d in senate_matches],
            "assembly": [to_dict(d) for d in assembly_matches],
            "congressional": [to_dict(d) for d in congressional_matches],
            "healthservicearea": [to_hsa_dict(d) for d in healthservicearea_matches],
            "LaServicePlanning": [to_laspa_dict(d) for d in laserviceplanningarea_matches],  
            "RegisteredNurseShortageArea": [to_rnsa_dict(d) for d in registerednurseshortagearea_matches],
            "MedicalServiceStudyArea": [to_mssa_dict(d) for d in medicalservicestudyarea_matches],
            "PrimaryCareShortageArea": [to_pcsa_dict(d) for d in primarycareshortagearea_matches],
            "PrimaryCareHPSA": [to_primary_hpsa_dict(primary_match)] if primary_match else [],
            "MentalHealthHPSA": [to_mental_hpsa_dict(mental_match)]if mental_match else [],
            "DentalHealthHPSA": [to_dental_hpsa_dict(dental_match)]if dental_match else [],
        }

        if any(cache_value.values()):
            cache.set(cache_key, json.dumps(cache_value), ex=TTL)

        return JsonResponse(cache_value, safe=False)

    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(130, f"Error: {e}", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return JsonResponse({"success": False, "message": f"Error: {e}"}, safe=False)
        

# Define a schema for expected data
class OverrideLocationSchema(Schema):
    lat: float
    lon: float
    address: str

@router.get("/override-locations")
def check_override_location(request, address: str):
    """
    Check if the address is in the override list. If not, geocode it using Azure Maps.
    """
    # Check for override match
    try:
        override = OverrideLocation.objects.get(address__iexact=address.strip())
        print(override.latitude, override.longitude)
        return {
            "found": True,
            "latitude": override.latitude,
            "longitude": override.longitude,
        }
    except OverrideLocation.DoesNotExist:
        pass
    
    #print("override-locations: " + address + "\n")
    ''' 
    # Call Azure Maps if not found
    azure_key = settings.AZURE_MAPS_API_KEY
    response = requests.get(
        "https://atlas.microsoft.com/search/address/json",
        params={
            "api-version": "1.0",
            "subscription-key": azure_key,
            "query": address,
        },
    )
  
    if response.status_code == 200:
        results = response.json().get("results", [])
        if results:
            position = results[0]["position"]
            return {
                "found": False,
                "latitude": position["lat"],
                "longitude": position["lon"],
            }
    '''   
    return JsonResponse({"error": "Unable to geocode address"}, status=404)


@router.post("/override-location/")
def override_location(request, data: OverrideLocationSchema):
    """
    Receives latitude, longitude, and an address, then prints them to the terminal.
    """
    print(f"Received Data - Coordinates: ({data.lat}, {data.lon}), Address: {data.address}")

    return JsonResponse({"success": True, "message": "Coordinates and address logged successfully."})

class OverrideLocationIn(Schema):
    address: str
    latitude: float
    longitude: float
    
class OverrideLocationOut(Schema):
    id: int
    address: str
    latitude: float
    longitude: float
    
    
@router.post("/manual-overrides/upload-xlsx")
def upload_overrides_xlsx(request, file: UploadedFile = File(...)):
    """
    Expects an XLSX with:
    1) Address
    2) Latitude
    3) Longitude

    Example row: "123 Example St" | 40.7128 | -74.0060
    """
    try:
        wb = openpyxl.load_workbook(file.file)
        sheet = wb.active  # or specify a sheet name

        new_overrides = []
        # If row 1 is a header, start from row=2
        for row in sheet.iter_rows(min_row=2, values_only=True):
            address, lat, lon = row[0], row[1], row[2]
            #print(f"Row data: address={address}, lat={lat}, lon={lon}")
            if address and lat is not None and lon is not None:
                new_overrides.append(
                    OverrideLocation(address=address, latitude=lat, longitude=lon)
                )

        print(f"Parsed {len(new_overrides)} new overrides.")

        if not new_overrides:
            print("No valid rows found in XLSX.")
            try:
                stack = traceback.extract_stack()
                error_response(110, "No valid rows found in XLSX.", stack)
            except Exception as e:
                print(f"Error found but not logged into the database! {e}")
            return {"success": False, "message": "No valid rows found in XLSX"}

        with transaction.atomic():
            OverrideLocation.objects.bulk_create(new_overrides)

        print(f"Inserted {len(new_overrides)} overrides into the database.")
        return {
            "success": True,
            "message": f"Inserted {len(new_overrides)} overrides from XLSX."
        }

    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(133, f"Error during XLSX upload: {str(e)}", stack)
        except Exception as e:
             print(f"Error found but not logged into the database! {e}")
        return {"success": False, "message": f"Error processing XLSX: {str(e)}"}

@router.get("/manual-overrides", response=List[OverrideLocationOut])
def list_overrides(request):
    """
    GET /manual-overrides
    Returns all override entries.
    """
    try:
        qs = OverrideLocation.objects.all()
        count = qs.count()
        print(f"Found {count} override(s) in the database.")
        return qs
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(134, f"Error listing overrides: {str(e)}", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return []  # or raise HttpError(400, f"Error: {e}")


@router.post("/manual-overrides", response=OverrideLocationOut)
def create_override(request, payload: OverrideLocationIn):
    """
    POST /manual-overrides
    Creates a single override entry.
    """
    print(f"Creating new override with data: {payload.dict()}")
    try:
        obj = OverrideLocation.objects.create(**payload.dict())
        print(f"Override created with ID={obj.id}")
        return obj
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(135, f"Error creating override: {str(e)}", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        # Return a fallback or raise an exception
        # but we must conform to response=OverrideLocationOut
        # So let's do a minimal approach:
        raise Exception(f"Failed to create override: {str(e)}")


@router.get("/manual-overrides/{override_id}", response=OverrideLocationOut)
def retrieve_override(request, override_id: int):
    """
    GET /manual-overrides/{override_id}
    Retrieves a single override entry by its ID.
    """
    print(f"Retrieving override with ID={override_id}")
    try:
        obj = get_object_or_404(OverrideLocation, id=override_id)
        print(f"Found override: {obj}")
        return obj
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(136, f"Error retrieving override {override_id}: {str(e)}", stack)
        except Exception as e:
             print(f"Error found but not logged into the database! {e}")
        raise Exception(f"Failed to retrieve override: {str(e)}")


@router.put("/manual-overrides/{override_id}", response=OverrideLocationOut)
def update_override(request, override_id: int, payload: OverrideLocationIn):
    """
    PUT /manual-overrides/{override_id}
    Fully updates an override entry by its ID.
    """
    print(f"Updating override with ID={override_id} using data={payload.dict()}")
    try:
        obj = get_object_or_404(OverrideLocation, id=override_id)
        for attr, value in payload.dict().items():
            setattr(obj, attr, value)
        obj.save()
        print(f"Override with ID={override_id} updated successfully.")
        return obj
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(137, f"Error updating override {override_id}: {str(e)}", stack)
        except Exception as e:
             print(f"Error found but not logged into the database! {e}")
        raise Exception(f"Failed to update override: {str(e)}")

@router.delete("/manual-overrides/{override_id}")
def delete_override(request, override_id: int):
    """
    DELETE /manual-overrides/{override_id}
    Deletes an override entry by its ID.
    """
    print(f"Deleting override with ID={override_id}")
    try:
        obj = get_object_or_404(OverrideLocation, id=override_id)
        obj.delete()
        msg = f"Override {override_id} deleted"
        print(msg)
        return {"success": True, "message": msg}
    except Exception as e:
        print(f"Error deleting override {override_id}: {e}")
        try:
            stack = traceback.extract_stack()
            error_response(138, f"Error deleting override {override_id}: {str(e)}", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return {"success": False, "message": f"Failed to delete: {str(e)}"}
    

User = get_user_model()

@router.get("/active-sessions")
def active_sessions(request):
    """
    Returns how many unexpired sessions belong to:
      - Admin users (staff or superuser)
      - Normal (non-admin) users
    """
    sessions = Session.objects.filter(expire_date__gte=timezone.now())

    admin_count = 0
    normal_count = 0

    for session in sessions:
        data = session.get_decoded()
        user_id = data.get("_auth_user_id")
        if user_id is not None:
            try:
                user = User.objects.get(pk=user_id)
                if user.is_staff or user.is_superuser:
                    admin_count += 1
                else:
                    normal_count += 1
            except User.DoesNotExist:
                pass

    return {
        "admin_count": admin_count,
        "normal_count": normal_count,
    }

'''
Endpoint deals with errors viewable by admins.
''' 
class AdminErrorSchema(Schema):
    id: int
    error_code: int
    error_description: str
    files_name: str
    line_number: str
    created_at: datetime = Field(..., format="iso8601")  

class APIKeySchema(Schema):
    key: str
    app_name: str
    usage_count: int

class APIKeyRevokeIn(Schema):
    api_key: str

@router.get("/admin_errors/", response=List[AdminErrorSchema])
def admin_errors(request):
    return AdminErrors.objects.all().order_by('-created_at')

@router.delete("/admin_errors/{id}/")
def delete_admin_error(request, id: int):
    error = get_object_or_404(AdminErrors, id=id)
    error.delete()
    return {"success": True, "message": f"Error {id} deleted"}

@router.get("/api-keys/", response=List[APIKeySchema])
def get_api_keys(request):
    return APIKey.objects.filter(revoked=False).order_by('-created_at')



@router.post("/revoke-api-key/")
def revoke_api_key(request, payload: APIKeyRevokeIn):
    try:
        key_obj = get_object_or_404(APIKey, key=payload.api_key)
        key_obj.revoked = True
        key_obj.save()
        return {"success": True, "message": f"API key revoked successfully."}
    except Exception as e:
        print(f"Failed to revoke API key: {e}")
        try:
            stack = traceback.extract_stack()
            error_response(140, f"Revoke failed: {str(e)}", stack)
        except:
            print("Could not log error in AdminErrors.")
        return {"success": False, "message": f"Failed to revoke API key."}
    
def error_response(code, description, stk):
    caller_frame = stk[-1]  
    filename = caller_frame.filename
    line = caller_frame.lineno
    AdminErrors.objects.create(
        error_code=code,
        error_description=description,
        files_name=filename,
        line_number=str(line)
    )

def check_container_status(client, container_name):
    try:
        container = client.containers.get(container_name)
        return container.status == 'running'
    except Exception:
        try:
            stack = traceback.extract_stack()
            error_response(150, f"Checking container status failed", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return False

def check_postgis_status():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            return True
    except Exception:
        try:
            stack = traceback.extract_stack()
            error_response(150, f"PostGIS status check failed", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return False

@router.get("/service_status/")
def service_status(request):
    try:
        client = from_env()
    except Exception as e:
        try:
            stack = traceback.extract_stack()
            error_response(160, f"Error connecting to Docker: {str(e)}", stack)
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return JsonResponse({"error": f"Error connecting to docker: {e}"}, status=500)
    
    status = {
        'redis': check_container_status(client, 'geo_cache'),
        'postgis': check_postgis_status(),
        'django': check_container_status(client, 'geo_django'),
        'react': check_container_status(client, 'geo_react')
    }
    return status



def to_hsa_dict(obj):
    if not obj:
        return {}

    return {
        "hsa_name": obj.hsa_name,
        "hsa_number": obj.hsa_number,
    }

def to_laspa_dict(obj):
    if not obj:
        return {}

    return {
        "spa_name": obj.spa_name,
    }

def to_rnsa_dict(obj):
    if not obj:
        return {}

    return {
        "rnsa": obj.rnsa,
        "Effective": obj.severity,
    }

def to_mssa_dict(obj):
    if not obj:
        return {}

    return {
        "mssaid": obj.mssaid,
        "definition": obj.definition,
        "county": obj.county_nm,
        "censustract": obj.tractce,
        "censuskey": obj.geoid,
    }

def to_pcsa_dict(obj):
    if not obj:
        return {}

    return {
        "pcsa": obj.pcsa,
        "scoretota": obj.score_tota,
        "mssa": obj.cnty_fips
    }

def to_dental_hpsa_dict(obj):
    return {
        "HPSA Source ID": obj.hpsa_id or "N/A",
        "Designated": "Yes",
        "Designated On": obj.hpsa_designation_date.isoformat() if obj.hpsa_designation_last_update_date else "N/A",
        "Formal Ratio": obj.hpsa_formal_ratio or "N/A",
        "Population Below Poverty": obj.percent_population_below_poverty or "N/A",
        "Designation Population": obj.hpsa_designation_population or "N/A",
        "Estimated Underserved": obj.hpsa_estimated_underserved_population or "N/A", 
        "Estimated Served": obj.hpsa_estimated_served_population or "N/A", 
        "Priority Score": obj.hpsa_score or "N/A",
    }


def to_mental_hpsa_dict(obj):
    return {
        "HPSA Source ID": obj.hpsa_id or "N/A",
        "Designated": "Yes",
        "Designated On": obj.hpsa_designation_date.isoformat() if obj.hpsa_designation_last_update_date else "N/A",
        "Formal Ratio": obj.hpsa_formal_ratio or "N/A",
        "Population Below Poverty": obj.percent_population_below_poverty or "N/A",
        "Designation Population": obj.hpsa_designation_population or "N/A",
        "Estimated Underserved": obj.hpsa_estimated_underserved_population or "N/A", 
        "Estimated Served": obj.hpsa_estimated_served_population or "N/A", 
        "Priority Score": obj.hpsa_score or "N/A",
    }



def to_primary_hpsa_dict(obj):
    return {
        "HPSA Source ID": obj.hpsa_id or "N/A",
        "Designated": "Yes",
        "Designated On": obj.hpsa_designation_date.isoformat() if obj.hpsa_designation_last_update_date else "N/A",
        "Formal Ratio": obj.hpsa_formal_ratio or "N/A",
        "Population Below Poverty": obj.percent_population_below_poverty or "N/A",
        "Designation Population": obj.hpsa_designation_population or "N/A",
        "Estimated Underserved": obj.hpsa_estimated_underserved_population or "N/A", 
        "Estimated Served": obj.hpsa_estimated_served_population or "N/A", 
        "Priority Score": obj.hpsa_score or "N/A",
    }


