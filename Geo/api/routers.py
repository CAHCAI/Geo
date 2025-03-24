import datetime
import os
from shutil import rmtree
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
from .models import AssemblyDistrict, SenateDistrict, AdminErrors, CongressionalDistrict, HealthServiceArea, MedicalServiceStudyArea,RegisteredNurseShortageArea, LAServicePlanningArea, PrimaryCareShortageArea
import json
from Geo.cache import cache, TTL
from typing import List, Optional
import openpyxl
from django.db import transaction
from .models import OverrideLocation
from django.contrib.sessions.models import Session
from django.utils import timezone
from django.contrib.auth import get_user_model


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
            AdminErrors.objects.create(error_code=131, error_description=f"Redis failed: {str(e)}")
            print("Error successfully logged in the database")
        except Exception as e:
            print(f"rror found but not logged into the database! {e}")
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
            AdminErrors.objects.create(error_code=503, error_description="Invalid file type specifier")
            print("Error successfully logged in the database")
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
            AdminErrors.objects.create(error_code=500, error_description="CSV must be uploaded under Health Provider Shortage Areas (HPSA)")
            print("Error successfully logged in the database")
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
                AdminErrors.objects.create(error_code=501, error_description="No shapefile found in the .zip archive.")
                print("Error successfully logged in the database")
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
                AdminErrors.objects.create(error_code=400, error_description="Invalid selected shapefile type.")
                print("Error successfully logged in the database")
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
                    AdminErrors.objects.create(error_code=400, error_description="Unknown shapefile type")
                    print("Error successfully logged in the database")
                except Exception as e:
                    print(f"Error creating log in the database: {e}")
                return JsonResponse({"success": False, "error": "Unknown shapefile type", "status":400}, status=400)
        except Exception as e:
            print(f"Error uploading shapefile of type {file_type}: {e}")
            try:
                AdminErrors.objects.create(error_code=400, error_description=f"Shapefile of type '{file_type}' failed: {e}")
                print("Error successfully logged in the database")
            except Exception as e:
                print(f"Error creating log in the database: {e}")
            return JsonResponse({"success" : False, "message": f"Shapefile of type '{file_type}' failed: {e}"}, status=400)
        # return on success
        return JsonResponse({"success" : True, "message": f"Shapefile of type '{file_type}' uploaded and processed successfully."})
    except Exception as e:
        try:
            AdminErrors.objects.create(error_code=400, error_description=f"Error response {e}")
            print("Error successfully logged in the database")
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
    # Assembly with GeoJSON
    assembly_qs = (
        AssemblyDistrict.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))  # Convert geom to GeoJSON
        .values(
            'id', 'district_number', 'area', 'population',
            # list all the numeric fields you want,
            'geom_geojson'  # The annotated GeoJSON field
        )
    )
    assembly_data = list(assembly_qs)

    # Senate with GeoJSON
    senate_qs = (
        SenateDistrict.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values(
            'id', 'district_number', 'area', 'population',
            'geom_geojson'
        )
    )
    senate_data = list(senate_qs)

    # Congressional with GeoJSON
    congress_qs = (
        CongressionalDistrict.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values(
            'id', 'district_number', 'area', 'population',
            'geom_geojson'
        )
    )
    congress_data = list(congress_qs)

    # HSA with GeoJSON
    hsa_qs = (
        HealthServiceArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values(
            'hsa_name', 'geom_geojson'
        )
    )
    hsa_data = list(hsa_qs)

    laspa_qs = (
        LAServicePlanningArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values(
            'spa_name', 'geom_geojson'
        )
    )
    laspa_data = list(laspa_qs)

    rnsa_qs = (
        RegisteredNurseShortageArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values(
            'rnsa','severity', 'geom_geojson'
        )
    )
    rnsa_data = list(rnsa_qs)

    mssa_qs = (
        MedicalServiceStudyArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values(
            'mssaid', 'geom_geojson'
        )
    )
    mssa_data = list(mssa_qs)

    pcsa_qs = (
        PrimaryCareShortageArea.objects
        .annotate(geom_geojson=AsGeoJSON('geom'))
        .values(
            'pcsa', 'geom_geojson'
        )
    )
    pcsa_data = list(pcsa_qs)


    return JsonResponse({
        "assembly_districts": assembly_data,
        "senate_districts": senate_data,
        "congressional_districts": congress_data,
        "health_service_data": hsa_data,
        "la_service_planning": laspa_data,
        "rnsa": rnsa_data,
        "mssa": mssa_data,
        "pcsa": pcsa_data,
    })

@router.get("/search")
@api_key_required
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

        cache_value = {
            "senate": [to_dict(d) for d in senate_matches],
            "assembly": [to_dict(d) for d in assembly_matches],
            "congressional": [to_dict(d) for d in congressional_matches],
            "healthservicearea": [to_hsa_dict(d) for d in healthservicearea_matches],
            "LaServicePlanning": [to_laspa_dict(d) for d in laserviceplanningarea_matches],
            "RegisteredNurseShortageArea": [to_rnsa_dict(d) for d in registerednurseshortagearea_matches],
            "MedicalServiceStudyArea": [to_mssa_dict(d) for d in medicalservicestudyarea_matches],
            "PrimaryCareShortageArea": [to_pcsa_dict(d) for d in primarycareshortagearea_matches],
        }

        if any(cache_value.values()):
            cache.set(cache_key, json.dumps(cache_value), ex=TTL)

        return JsonResponse(cache_value, safe=False)

    except Exception as e:
<<<<<<< Updated upstream
        try:
            AdminErrors.objects.create(error_code=130, error_description=f"Error: {e}")
            print("Error successfully logged in the database")
        except Exception as e:
            print(f"Error found but not logged into the database! {e}")
        return JsonResponse({"success": False, "message": f"Error: {e}"}, safe=False)
        
    
    point = Point(lng, lat, srid=4326)

    senate_matches = SenateDistrict.objects.filter(geom__contains=point)
    assembly_matches = AssemblyDistrict.objects.filter(geom__contains=point)
    congressional_matches = CongressionalDistrict.objects.filter(geom__contains=point)
    healthservicearea_matches = HealthServiceArea.objects.filter(geom__contains=point)
    laserviceplanningarea_matches = LAServicePlanningArea.objects.filter(geom__contains=point)
    registerednurseshortagearea_matches = RegisteredNurseShortageArea.objects.filter(geom__contains=point)
    medicalservicestudyarea_matches = MedicalServiceStudyArea.objects.filter(geom__contains=point)
    primarycareshortagearea_matches = PrimaryCareShortageArea.objects.filter(geom__contains=point)

    cache_value = {
        "senate": [to_dict(d) for d in senate_matches],
        "assembly": [to_dict(d) for d in assembly_matches],
        "congressional": [to_dict(d) for d in congressional_matches],
        "healthservicearea": [to_hsa_dict(d) for d in healthservicearea_matches],
        "LaServicePlanning": [to_laspa_dict(d) for d in laserviceplanningarea_matches],  
        "RegisteredNurseShortageArea": [to_rnsa_dict(d) for d in registerednurseshortagearea_matches],
        "MedicalServiceStudyArea": [to_mssa_dict(d) for d in medicalservicestudyarea_matches],
        "PrimaryCareShortageArea": [to_pcsa_dict(d) for d in primarycareshortagearea_matches], 
    }

    if any(cache_value.values()):  # Check if any list has data
        try:
            cache.set(cache_key, json.dumps(cache_value), ex=TTL)  #Stores in cache
        except Exception as e:
            try:
                AdminErrors.objects.create(error_code=130, error_description=f"Cache error: {e}")
                print("Error successfully logged in the database")
            except Exception as e:
                print(f"Error found but not logged into the database! {e}")
            return JsonResponse({"success": False, "message": f"Cache error: {e}"}, safe=False)

    return JsonResponse(cache_value, safe=False) 
=======
        print(f"❌ Coordinate Search Error: {e}")
        return JsonResponse({"success": False, "error": str(e)}, status=500)
>>>>>>> Stashed changes


# Define a schema for expected data
class OverrideLocationSchema(Schema):
    lat: float
    lon: float
    address: str

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
                AdminErrors.objects.create(error_code=110, error_description="No valid rows found in XLSX")
                print("Error successfully logged in the database")
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
        print(f"Error during XLSX upload: {e}")
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
        print(f"Error listing overrides: {e}")
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
        print(f"Error creating override: {e}")
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
        print(f"Error retrieving override {override_id}: {e}")
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
        print(f"Error updating override {override_id}: {e}")
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
            AdminErrors.objects.create(error_code=111, error_description=f"Failed to delete: {str(e)}")
            print("Error successfully logged in the database")
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
    created_at: datetime = Field(..., format="iso8601")  

@router.get("/admin_errors/", response=List[AdminErrorSchema])
def admin_errors(request):
    return AdminErrors.objects.all().order_by('-created_at')

@router.delete("/admin_errors/{id}/")
def delete_admin_error(request, id: int):
    error = get_object_or_404(AdminErrors, id=id)
    error.delete()
    return {"success": True, "message": f"Error {id} deleted"}


def to_hsa_dict(obj):
    if not obj:
        return {"N/A"}

    return {
        "hsa_name": obj.hsa_name,
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
    }

def to_pcsa_dict(obj):
    if not obj:
        return {}

    return {
        "pcsa": obj.pcsa,
        #add more object if needed
    }

<<<<<<< Updated upstream
=======
api = Router()

#@api.post("/generate-api-key", tags=["Admin"])
#def generate_api_key(request):
   # raw_key = APIKey.generate()  # This returns the unhashed key once
 #   return {"api_key": raw_key}
>>>>>>> Stashed changes
