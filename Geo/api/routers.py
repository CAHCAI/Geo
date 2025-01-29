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
