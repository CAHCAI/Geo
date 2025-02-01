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
    return JsonResponse({"success": True, "message": "test api, successful."})


# Field mapping: map model field names to shapefile field names.
assembly_shp_mapping = {
    'district_number': 'DISTRICT',     # shapefile field "DISTRICT" → model field "district_number"
    'area': 'AREA',                    # shapefile field "AREA" → model field "area"
    'members': 'MEMBERS',              # shapefile field "MEMBERS" → model field "members"
    'population': 'POPULATION',        # shapefile field "POPULATION" → model field "population"
    'cvap_19': 'CVAP_19',              # shapefile field "CVAP_19" → model field "cvap_19"
    'hsp_cvap_1': 'HSP_CVAP_1',        # shapefile field "HSP_CVAP_1" → model field "hsp_cvap_1"
    'doj_nh_blk': 'DOJ_NH_BLK',        # shapefile field "DOJ_NH_BLK" → model field "doj_nh_blk"
    'doj_nh_asn': 'DOJ_NH_ASN',        # shapefile field "DOJ_NH_ASN" → model field "doj_nh_asn"
    'nh_wht_cva': 'NH_WHT_CVA',        # shapefile field "NH_WHT_CVA" → model field "nh_wht_cva"
    'ideal_value': 'IDEAL_VALU',       # shapefile field "IDEAL_VALU" → model field "ideal_value"
    'deviation': 'DEVIATION',          # shapefile field "DEVIATION" → model field "deviation"
    'f_deviatio': 'F_DEVIATIO',        # shapefile field "F_DEVIATIO" → model field "f_deviatio"
    'f_cvap_19': 'F_CVAP_19',          # shapefile field "F_CVAP_19" → model field "f_cvap_19"
    'f_hsp_cvap': 'F_HSP_CVAP',        # shapefile field "F_HSP_CVAP" → model field "f_hsp_cvap"
    'f_doj_nh_b': 'F_DOJ_NH_B',        # shapefile field "F_DOJ_NH_B" → model field "f_doj_nh_b"
    'f_doj_nh_a': 'F_DOJ_NH_A',        # shapefile field "F_DOJ_NH_A" → model field "f_doj_nh_a"
    'f_nh_wht_c': 'F_NH_WHT_C',        # shapefile field "F_NH_WHT_C" → model field "f_nh_wht_c"
    'district_n': 'DISTRICT_N',        # shapefile field "DISTRICT_N" → model field "district_n"
    'district_label': 'DISTRICT_L',    # shapefile field "DISTRICT_L" → model field "district_label"
    'geom': 'MULTIPOLYGON',            # For geometry
}


def import_assembly_shapefile(shp_path):
    """
    Imports a shapefile into the AssemblyDistrict model using LayerMapping.
    
    Parameters:
        shp_path (str): Full path to the .shp file. The accompanying .dbf, .shx, and .prj files
                        must be in the same directory.
    """
    # Create a LayerMapping instance.
    # Set transform=True if the shapefile's spatial reference differs from your database (commonly EPSG:4326).
    lm = LayerMapping(AssemblyDistrict, shp_path, assembly_shp_mapping, transform=True, encoding='utf-8')
    lm.save(strict=True, verbose=True)

@router.post("/upload-shapefile/")
def upload_shapefile(request, file: UploadedFile = File(...)):
    """
    Accepts an uploaded .zip file, extracts it, searches for shapefiles,
    and returns the paths of the found shapefiles in a JSON response.
    """

    # Generate a unique file name to avoid collisions
    unique_filename = f"{uuid.uuid4()}_{file.name}"
    
    # Create a directory for the uploaded zip files
    upload_dir = os.path.join(settings.MEDIA_ROOT, "shapefiles")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Construct the full file path
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save the file to disk by writing chunks
    with open(file_path, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    
    # Extracts the zip file
    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            zf.extractall(upload_dir)
    except zipfile.BadZipFile:
        return JsonResponse({"success": False, "error": "Uploaded file is not a valid zip file."})
    

    # Search for the .shp file in the upload directory
    shapefile_paths = None
    for root, dirs, files in os.walk(upload_dir):
        for name in files:
            if name.lower().endswith('.shp'):
                shapefile_paths = os.path.join(root, name)
                break
        if shapefile_paths:
            break

    # Return an appropriate response based on whether shapefiles were found
    if not shapefile_paths:
        return JsonResponse({
            "success": False,
            "message": "File uploaded and extracted successfully, but no shapefile (.shp) was found.",
        })
    
    # Import the shapefile data into the database
    try:
        import_assembly_shapefile(shapefile_paths)
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": f"Error importing shapefile: {e}"
        })
    
    #debug purposes
    return JsonResponse({
        "success": True,
        "message": "File uploaded and extracted successfully.",
        "uploaded_file_path": file_path,
        "extracted_directory": upload_dir,
        "shapefiles_found": shapefile_paths
    })



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




@router.get("/nearest-location/")
def nearest_location(request, longitude: float, latitude: float):
    """
    Accepts a longitude and latitude as query parameters and returns the nearest
    AssemblyDistrict record (with all its fields) from the database.
    
    """
    # Create a geospatial point (assumes EPSG:4326 coordinate system)
    test_point = Point(longitude, latitude, srid=4326)
    
    # Annotate the AssemblyDistrict queryset with distance from the test point,
    # then order by distance (ascending)
    qs = AssemblyDistrict.objects.annotate(distance=Distance("geom", test_point)).order_by("distance")
    
    if not qs.exists():
        return JsonResponse({"success": False, "error": "No location found."})
    
    # Get the nearest record
    nearest = qs.first()
    
    # Prepare the response data. Adjust the field names as needed.
    data = {
        "id": nearest.id,
        "district_number": nearest.district_number,
        "area": nearest.area,
        "members": nearest.members,
        "population": nearest.population,
        "cvap_19": nearest.cvap_19,
        "hsp_cvap_1": nearest.hsp_cvap_1,
        "doj_nh_blk": nearest.doj_nh_blk,
        "doj_nh_asn": nearest.doj_nh_asn,
        "nh_wht_cva": nearest.nh_wht_cva,
        "ideal_value": nearest.ideal_value,
        "deviation": nearest.deviation,
        "f_deviatio": nearest.f_deviatio,
        "f_cvap_19": nearest.f_cvap_19,
        "f_hsp_cvap": nearest.f_hsp_cvap,
        "f_doj_nh_b": nearest.f_doj_nh_b,
        "f_doj_nh_a": nearest.f_doj_nh_a,
        "f_nh_wht_c": nearest.f_nh_wht_c,
        "district_n": nearest.district_n,
        "district_label": nearest.district_label,
    }
    
    return JsonResponse({"success": True, "data": data})







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