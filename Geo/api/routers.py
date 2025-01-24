import os
from shutil import rmtree
import subprocess
import zipfile
from django.conf import settings
from django.http import JsonResponse
from ninja import Router, File
from ninja.files import UploadedFile

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
def upload_shapefile(request, shapefile: UploadedFile = File(...)):  # type: ignore
    """
    Endpoint to upload a shapefile (.zip) and load it into the database.
    """
    # Save the uploaded file
    zip_path = os.path.join(UPLOAD_DIR, shapefile.name)
    with open(zip_path, "wb") as f:
        for chunk in shapefile.chunks():
            f.write(chunk)

    # Extract the zip file
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(UPLOAD_DIR)

    # Find the .shp file in the extracted files
    shp_file = None
    for file in zip_ref.namelist():
        if file.endswith(".shp"):
            shp_file = os.path.join(UPLOAD_DIR, file)
            break

    if not shp_file:
        return JsonResponse({"success": False, "error": "No .shp file found in the uploaded zip."}, status=400)

    # Define table name and SQL path
    table_name = os.path.splitext(os.path.basename(shp_file))[0]
    sql_path = os.path.join(UPLOAD_DIR, f"{table_name}.sql")

    try:
        # Convert shapefile to SQL using shp2pgsql
        subprocess.run(
            [
                "shp2pgsql",
                "-s", "4326",  # EPSG:4326 spatial reference system (WGS 84)
                "-I",          # Create spatial index
                shp_file,
                table_name,
            ],
            stdout=open(sql_path, "w"),
            check=True,
        )

        # Execute the SQL to insert data into the PostgreSQL database
        subprocess.run(
            [
                "psql",
                "-U", settings.DATABASES["default"]["USER"],
                "-d", settings.DATABASES["default"]["NAME"],
                "-h", settings.DATABASES["default"]["HOST"],
                "-p", settings.DATABASES["default"]["PORT"],
                "-f", sql_path,
            ],
            check=True,
            env={
                "PGPASSWORD": settings.DATABASES["default"]["PASSWORD"]
            },
        )

        return JsonResponse({"success": True, "message": f"Shapefile {shapefile.name} uploaded and data loaded into the database."})
    except subprocess.CalledProcessError as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    finally:
        # Clean up the entire directory
        try:
            rmtree(UPLOAD_DIR)
            os.makedirs(UPLOAD_DIR)  # Recreate the directory after cleanup
        except Exception as cleanup_error:
            print(f"Error during cleanup: {cleanup_error}")
