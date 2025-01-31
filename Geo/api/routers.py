import os
from shutil import rmtree
import subprocess
import zipfile
from django.conf import settings
from django.http import JsonResponse
from ninja import Router, File
from ninja.files import UploadedFile
from tempfile import TemporaryDirectory
from .utils import (extract_zip, find_shapefile, get_shapefile_metadata, 
identify_shapefile_type, upload_assembly_shapefile, upload_congressional_shapefile, upload_senate_shapefile, get_shapefile_layer)
from django.db import connection
from django.contrib.gis.db.models.functions import AsGeoJSON
from .models import AssemblyDistrict, SenateDistrict, CongressionalDistrict

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
    return JsonResponse({"success": True, "message": "test successful."})

@router.post("/upload-shapefile/")
def upload_shapefile(request, file: UploadedFile = File(...)): # type: ignore
    """
    Upload a shapefile (as .zip) and populate the respective model.
    """
    # Extract the zip file
    print("here")
    tmp_dir = extract_zip(file) # type: ignore

    try:
        # Get the path to the shapefile (.shp)
        shapefile_path = find_shapefile(tmp_dir.name)

        # Check if a shapefile is found
        if not shapefile_path:
            return JsonResponse({"success": False, "error": "No shapefile found in the .zip archive."})

        # Get metadata from the shapefile
        fields = get_shapefile_metadata(shapefile_path)

        # Identify the type of shapefile
        shapefile_type = identify_shapefile_type(fields)

        layer = get_shapefile_layer(shapefile_path)

        # Process the shapefile based on its type
        if shapefile_type == "assembly":
            upload_assembly_shapefile(layer)
        elif shapefile_type == "senate":
            upload_senate_shapefile(layer)
        elif shapefile_type == "congressional":
            upload_congressional_shapefile(layer)
        else:
            return JsonResponse({"success": False, "error": "Unknown shapefile type"})

        return JsonResponse({"success": True, "message": f"Shapefile of type '{shapefile_type}' uploaded and processed successfully."})
    finally:
        # Cleanup the temporary directory
        tmp_dir.cleanup()



#Test 
@router.get("/dev-credentials")
def dev_credentials(request):
   
    return {
        "admin_username": "admin",
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