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
from ninja import Router, File, Schema
from ninja.files import UploadedFile
from tempfile import TemporaryDirectory
from .utils import (extract_zip, find_shapefile, get_shapefile_metadata, 
identify_shapefile_type, upload_assembly_shapefile, upload_congressional_shapefile, upload_senate_shapefile, get_shapefile_layer, to_dict)
from django.db import connection
from django.contrib.gis.db.models.functions import AsGeoJSON
from .models import AssemblyDistrict, SenateDistrict, CongressionalDistrict
import json
from Geo.cache import cache

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

# Mapping dictionary for the SenateDistrict model
senate_shp_mapping = {
    'district_number': 'DISTRICT',       # Shapefile field "DISTRICT" → model field "district_number"
    'area': 'AREA',                      # Shapefile field "AREA" → model field "area"
    'members': 'MEMBERS',                # Shapefile field "MEMBERS" → model field "members"
    'name': 'NAME',
    'population': 'POPULATION',          # Shapefile field "POPULATION" → model field "population"
    'cvap_19': 'CVAP_19',                # Shapefile field "CVAP_19" → model field "cvap_19"
    'hsp_cvap_1': 'HSP_CVAP_1',          # Shapefile field "HSP_CVAP_1" → model field "hsp_cvap_1"
    'doj_nh_ind': 'DOJ_NH_IND',          # Shapefile field "DOJ_NH_IND" → model field "doj_nh_ind"
    'doj_nh_blk': 'DOJ_NH_BLK',          # Shapefile field "DOJ_NH_BLK" → model field "doj_nh_blk"
    'doj_nh_asn': 'DOJ_NH_ASN',          # Shapefile field "DOJ_NH_ASN" → model field "doj_nh_asn"
    'nh_wht_cva': 'NH_WHT_CVA',              # Shapefile field "NH_WHT_C" → model field "nh_wht_c"
    'ideal_valu': 'IDEAL_VALU',         # Shapefile field "IDEAL_VALU" → model field "ideal_value"
    'deviation': 'DEVIATION',            # Shapefile field "DEVIATION" → model field "deviation"
    'f_deviatio': 'F_DEVIATIO',        # Shapefile field "F_DEVIATION" → model field "f_deviation"
    'f_cvap_19': 'F_CVAP_19',            # Shapefile field "F_CVAP_19" → model field "f_cvap_19"
    'f_hsp_cvap': 'F_HSP_CVAP',      # Shapefile field "F_HSP_CVAP_1" → model field "f_hsp_cvap_1"
    'f_doj_nh_i': 'F_DOJ_NH_I',
    'f_doj_nh_b': 'F_DOJ_NH_B',          # Shapefile field "F_DOJ_NH_B" → model field "f_doj_nh_b"
    'f_doj_nh_a': 'F_DOJ_NH_A',          # Shapefile field "F_DOJ_NH_A" → model field "f_doj_nh_a"
    'f_nh_wht_c': 'F_NH_WHT_C',          # Shapefile field "F_NH_WHT_C" → model field "f_nh_wht_c"
    'district_label': 'DISTRICT_L',      # Shapefile field "DISTRICT_L" → model field "district_label"
    'multiple_f': 'MULTIPLE_F',          # Shapefile field "MULTIPLE_F" → model field "multiple_f"
    'geom': 'MULTIPOLYGON',              # Geometry field: typically the shapefile contains a "MULTIPOLYGON" geometry
}

# Mapping dictionary for the CongressionalDistrict model
congressional_shp_mapping = {
    'district_number': 'DISTRICT',      # shapefile field "DISTRICT" → model field "district_number"
    'area': 'AREA',                     # shapefile field "AREA" → model field "area"
    'members': 'MEMBERS',               # shapefile field "MEMBERS" → model field "members"
    'population': 'POPULATION',         # shapefile field "POPULATION" → model field "population"
    'cvap_19': 'CVAP_19',               # shapefile field "CVAP_19" → model field "cvap_19"
    'hsp_cvap_1': 'HSP_CVAP_1',         # shapefile field "HSP_CVAP_1" → model field "hsp_cvap_1"
    'doj_nh_blk': 'DOJ_NH_BLK',         # shapefile field "DOJ_NH_BLK" → model field "doj_nh_blk"
    'doj_nh_asn': 'DOJ_NH_ASN',         # shapefile field "DOJ_NH_ASN" → model field "doj_nh_asn"
    'nh_wht_cva': 'NH_WHT_CVA',         # shapefile field "NH_WHT_CVA" → model field "nh_wht_cva"
    'ideal_value': 'IDEAL_VALU',        # shapefile field "IDEAL_VALU" → model field "ideal_value"
    'deviation': 'DEVIATION',           # shapefile field "DEVIATION" → model field "deviation"
    'f_deviatio': 'F_DEVIATIO',         # shapefile field "F_DEVIATIO" → model field "f_deviatio"
    'multiple_f': 'MULTIPLE_F',         # shapefile field "MULTIPLE_F" → model field "multiple_f"
    'f_cvap_19': 'F_CVAP_19',           # shapefile field "F_CVAP_19" → model field "f_cvap_19"
    'f_hsp_cvap': 'F_HSP_CVAP',         # shapefile field "F_HSP_CVAP" → model field "f_hsp_cvap"
    'f_doj_nh_b': 'F_DOJ_NH_B',         # shapefile field "F_DOJ_NH_B" → model field "f_doj_nh_b"
    'f_doj_nh_a': 'F_DOJ_NH_A',         # shapefile field "F_DOJ_NH_A" → model field "f_doj_nh_a"
    'f_nh_wht_c': 'F_NH_WHT_C',         # shapefile field "F_NH_WHT_C" → model field "f_nh_wht_c"
    'district_label': 'DISTRICT_L',     # shapefile field "DISTRICT_L" → model field "district_label"
    'district_n': 'DISTRICT_N',         # shapefile field "DISTRICT_N" → model field "district_n"
    'geom': 'MULTIPOLYGON',             # Geometry field; this tells LayerMapping which field contains the multipolygon geometries
}

def import_congressional_shapefile(shp_path):
    """
    Imports the congressional shapefile into the CongressionalDistrict model using LayerMapping.
    
    Parameters:
        shp_path (str): Full path to the .shp file.
                        (Ensure that the accompanying .dbf, .shx, and .prj files are in the same folder.)
    """
    lm = LayerMapping(CongressionalDistrict, shp_path, congressional_shp_mapping, transform=True, encoding='utf-8')
    lm.save(strict=True, verbose=True)


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


def import_senate_shapefile(shp_path):
    """
    Imports the shapefile data into the SenateDistrict model.
    
    Parameters:
        shp_path (str): Full path to the .shp file (with .dbf, .shx, and .prj files in the same directory).
    """
    lm = LayerMapping(SenateDistrict, shp_path, senate_shp_mapping, transform=True, encoding='utf-8')
    lm.save(strict=False, verbose=True)


@router.post("/upload-shapefile/")
def upload_shapefile(request, file: UploadedFile = File(...)):
    """
    Upload a shapefile (as .zip) and populate the respective model.
    """
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
        # return on success
        return JsonResponse({"success" : True, "message": f"Shapefile of type '{shapefile_type}' uploaded and processed successfully."})
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


@router.post("/upload-assembly-shapefile/")
def upload_assembly_shapefile_endpoint(request, file: UploadedFile = File(...)):
    """
    Expects a file named "ad.zip" containing an Assembly District shapefile.
    Saves, extracts, searches for the .shp file, and imports the data into AssemblyDistrict.
    """
    try:
        # For Assembly District, the uploaded file must be named "ad.zip"
        file_path, shp_path = process_uploaded_zip(file, "ad.zip")
        import_assembly_shapefile(shp_path)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})
    
    return JsonResponse({
        "success": True,
        "message": "Assembly district shapefile imported successfully.",
        "uploaded_file_path": file_path,
        "extracted_shapefile": shp_path,
    })

@router.post("/upload-senate-shapefile/")
def upload_senate_shapefile_endpoint(request, file: UploadedFile = File(...)):
    """
    Expects a file named "sd.zip" containing a Senate District shapefile.
    Saves, extracts, searches for the .shp file, and imports the data into SenateDistrict.
    """
    try:
        # For Senate District, the uploaded file must be named "sd.zip"
        file_path, shp_path = process_uploaded_zip(file, "sd.zip")
        import_senate_shapefile(shp_path)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})
    
    return JsonResponse({
        "success": True,
        "message": "Senate district shapefile imported successfully.",
        "uploaded_file_path": file_path,
        "extracted_shapefile": shp_path,
    })

@router.post("/upload-congressional-shapefile/")
def upload_congressional_shapefile_endpoint(request, file: UploadedFile = File(...)):
    """
    Expects a file named "cd.zip" containing a Congressional District shapefile.
    Saves, extracts, searches for the .shp file, and imports the data into CongressionalDistrict.
    """
    try:
        # For Congressional District, the uploaded file must be named "cd.zip"
        file_path, shp_path = process_uploaded_zip(file, "cd.zip")
        import_congressional_shapefile(shp_path)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})
    
    return JsonResponse({
        "success": True,
        "message": "Congressional district shapefile imported successfully.",
        "uploaded_file_path": file_path,
        "extracted_shapefile": shp_path,
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
    Accepts a longitude and latitude as query parameters, creates a Point,
    and finds the nearest record in each of the AssemblyDistrict, SenateDistrict,
    and CongressionalDistrict models. Returns a JSON response with the details.
    """
    # Create a geospatial point (assumes EPSG:4326 coordinate system)
    test_point = Point(longitude, latitude, srid=4326)
    
    # Query each model and annotate with distance from the test point, ordering by distance.
    assembly_qs = AssemblyDistrict.objects.annotate(distance=Distance("geom", test_point)).order_by("distance")
    senate_qs = SenateDistrict.objects.annotate(distance=Distance("geom", test_point)).order_by("distance")
    congressional_qs = CongressionalDistrict.objects.annotate(distance=Distance("geom", test_point)).order_by("distance")
    
    # Get the nearest record from each queryset if it exists
    assembly_nearest = assembly_qs.first() if assembly_qs.exists() else None
    senate_nearest = senate_qs.first() if senate_qs.exists() else None
    congressional_nearest = congressional_qs.first() if congressional_qs.exists() else None

    # Prepare the response data for AssemblyDistrict
    assembly_data = None
    if assembly_nearest:
        assembly_data = {
            "id": assembly_nearest.id,
            "district_number": assembly_nearest.district_number,
            "area": assembly_nearest.area,
            "members": assembly_nearest.members,
            "population": assembly_nearest.population,
            "cvap_19": assembly_nearest.cvap_19,
            "hsp_cvap_1": assembly_nearest.hsp_cvap_1,
            "doj_nh_blk": getattr(assembly_nearest, "doj_nh_blk", None),
            "doj_nh_asn": getattr(assembly_nearest, "doj_nh_asn", None),
            "nh_wht_cva": getattr(assembly_nearest, "nh_wht_cva", None),
            "ideal_value": assembly_nearest.ideal_value,
            "deviation": assembly_nearest.deviation,
            "f_deviatio": assembly_nearest.f_deviatio,
            "f_cvap_19": assembly_nearest.f_cvap_19,
            "f_hsp_cvap": getattr(assembly_nearest, "f_hsp_cvap", None),
            "f_doj_nh_b": getattr(assembly_nearest, "f_doj_nh_b", None),
            "f_doj_nh_a": getattr(assembly_nearest, "f_doj_nh_a", None),
            "f_nh_wht_c": getattr(assembly_nearest, "f_nh_wht_c", None),
            "district_label": assembly_nearest.district_label,
            "distance_m": assembly_nearest.distance.m,
            # "geom": assembly_nearest.geom.geojson,
        }

    # Prepare the response data for SenateDistrict
    senate_data = None
    if senate_nearest:
        senate_data = {
            "id": senate_nearest.id,
            "district_number": senate_nearest.district_number,
            "area": senate_nearest.area,
            "members": senate_nearest.members,
            "population": senate_nearest.population,
            "cvap_19": senate_nearest.cvap_19,
            "hsp_cvap_1": senate_nearest.hsp_cvap_1,
            "doj_nh_blk": getattr(senate_nearest, "doj_nh_blk", None),
            "doj_nh_asn": getattr(senate_nearest, "doj_nh_asn", None),
            # For Senate, if "nh_wht_cva" is missing or named differently, adjust accordingly:
            "nh_wht_cva": getattr(senate_nearest, "nh_wht_cva", None),
            "ideal_value": senate_nearest.ideal_value,
            "deviation": senate_nearest.deviation,
            "f_deviation": senate_nearest.f_deviation,
            "f_cvap_19": senate_nearest.f_cvap_19,
            "f_hsp_cvap_1": getattr(senate_nearest, "f_hsp_cvap_1", None),
            "f_doj_nh_b": getattr(senate_nearest, "f_doj_nh_b", None),
            "f_doj_nh_a": getattr(senate_nearest, "f_doj_nh_a", None),
            # If the field "f_nh_wht_c" is missing, use getattr to safely fetch it:
            "f_nh_wht_c": getattr(senate_nearest, "f_nh_wht_c", None),
            "district_label": senate_nearest.district_label,
            "multiple_f": senate_nearest.multiple_f,
            "distance_m": senate_nearest.distance.m,
        }
    
    # Prepare the response data for CongressionalDistrict
    congressional_data = None
    if congressional_nearest:
        congressional_data = {
            "id": congressional_nearest.id,
            "district_number": congressional_nearest.district_number,
            "area": congressional_nearest.area,
            "members": congressional_nearest.members,
            "population": congressional_nearest.population,
            "cvap_19": congressional_nearest.cvap_19,
            "hsp_cvap_1": congressional_nearest.hsp_cvap_1,
            "doj_nh_blk": getattr(congressional_nearest, "doj_nh_blk", None),
            "doj_nh_asn": getattr(congressional_nearest, "doj_nh_asn", None),
            "nh_wht_cva": getattr(congressional_nearest, "nh_wht_cva", None),
            "ideal_value": congressional_nearest.ideal_value,
            "deviation": congressional_nearest.deviation,
            "f_deviatio": congressional_nearest.f_deviatio,
            "multiple_f": congressional_nearest.multiple_f,
            "f_cvap_19": congressional_nearest.f_cvap_19,
            "f_hsp_cvap": congressional_nearest.f_hsp_cvap,
            "f_doj_nh_b": congressional_nearest.f_doj_nh_b,
            "f_doj_nh_a": congressional_nearest.f_doj_nh_a,
            "f_nh_wht_c": congressional_nearest.f_nh_wht_c,
            "district_label": congressional_nearest.district_label,
            "district_n": congressional_nearest.district_n,
            "distance_m": congressional_nearest.distance.m,
        }
    
    # Create a combined result dictionary
    result = {
        "assembly": assembly_data,
        "senate": senate_data,
        "congressional": congressional_data,
    }
    
    return JsonResponse({"success": True, "data": result})





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
    try:
        # create a cached value with a 50 minute TTL
        cache.set(cache_key, json.dumps(cache_value), ex=3000)
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
