import os
from shutil import rmtree
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
# utility functions
from .utils import (extract_zip, find_shapefile, get_shapefile_metadata, 
identify_shapefile_type, upload_assembly_shapefile, upload_congressional_shapefile,
upload_laspa_shapefile, upload_senate_shapefile, get_shapefile_layer, to_dict, 
upload_hsa_shapefile, upload_rnsa_shapefile, upload_mssa_shapefile, upload_pcsa_shapefile)
# end utility functions
from django.db import connection
from django.contrib.gis.db.models.functions import AsGeoJSON
from .models import AssemblyDistrict, SenateDistrict, CongressionalDistrict
import json
from Geo.cache import cache, TTL

# Directory to temporarily store uploaded shapefiles
UPLOAD_DIR = os.path.join(settings.MEDIA_ROOT, "shapefiles")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create a router instance
router = Router()

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
        return JsonResponse({"success": False, "message": f"Redis failed: {str(e)}"})

@router.post("/upload-shapefile/")
def upload_shapefile(request, file: UploadedFile = File(...), file_type: str = Form(...)):
    """
    Upload a shapefile (as .zip) and populate the respective model.
    """
    # valid shapefile types for upload, any other files will get invalid filetype
    valid_types = {"assembly", "congressional", "senate", "laspa", "hsa", "rnsa", "mssa", "pcsa"}
    # lowercase the file type
    file_type = file_type.lower()
    if file_type not in valid_types:
        return JsonResponse({"success" : False, "message" : "Invalid file type specifier"})
    
    # Extract the zip file
    tmp_dir = extract_zip(file)

    try:
        # Get the path to the shapefile (.shp)
        shapefile_path = find_shapefile(tmp_dir.name)

        # Check if a shapefile is found
        if not shapefile_path:
            return {"error": "No shapefile found in the .zip archive."}

        # Get metadata from the shapefile
        fields = get_shapefile_metadata(shapefile_path)
        
        layer = get_shapefile_layer(shapefile_path)
        
        # try to identify the shapefile type
        validated_file_type = identify_shapefile_type(fields)
        
        if file_type != validated_file_type:
            print(f"mismatched filetype | valid: {validated_file_type}, given: {file_type}")
            return JsonResponse({"success": False, "error": "Invalid selected shapefile type."})

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
                return JsonResponse({"success": False, "error": "Unknown shapefile type"})
        except Exception as e:
            print(f"Error uploading shapefile of type {file_type}: {e}")
            return JsonResponse({"success" : False, "message": f"Shapefile of type '{file_type}' failed: {e}"})
        # return on success
        return JsonResponse({"success" : True, "message": f"Shapefile of type '{file_type}' uploaded and processed successfully."})
    except Exception as e:
        return JsonResponse({"success": False, "error": f"Error response {e}"})
    finally:
        # Cleanup the temporary directory
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

    return JsonResponse({
        "assembly_districts": assembly_data,
        "senate_districts": senate_data,
        "congressional_districts": congress_data,
    })

@router.get("/search")
def coordinate_search(request, lat: float, lng: float):
    """
    Search the district tables for polygons containing (lat, lng).
    """
    
    cache_key = f"{lat}_{lng}"
    
    # check if this point has been searched for recently in the cache
    try:
        cache_value = cache.get(cache_key)
        if cache_value:    
            cache_value = json.loads(cache_value)
            cache_value["used_cache"] = True
            return cache_value
    except Exception as e:
        return {"success": False, "message": f"Error: {e}"}
        
    # this runs if the lat long key was not found in the cache
    point = Point(lng, lat, srid=4326)
    
    senate_matches = SenateDistrict.objects.filter(geom__contains=point).distinct("district_number")
    assembly_matches = AssemblyDistrict.objects.filter(geom__contains=point).distinct("district_number")
    congressional_matches = CongressionalDistrict.objects.filter(geom__contains=point).distinct("district_number")
    
    # Convert to lists of dictionaries before caching
    cache_value = {
        "senate": [to_dict(d) for d in senate_matches],
        "assembly": [to_dict(d) for d in assembly_matches],
        "congressional": [to_dict(d) for d in congressional_matches],
    }
    # Don't cache if all results are empty
    if senate_matches.exists() or assembly_matches.exists() or congressional_matches.exists():
        try:
            # Create a cached value with a TTL
            cache.set(cache_key, json.dumps(cache_value), ex=TTL)
        except Exception as e:
            return {"success": False, "message": f"Error: {e}"}

    return cache_value



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
