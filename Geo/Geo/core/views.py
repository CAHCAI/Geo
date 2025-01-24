"""

example of a view

def example_view(request):
    return render(request, 'example.html', {})

"""
'''from ninja import Router
from django.conf import settings
from azure.identity import ClientSecretCredential
from azure.maps.search import MapsSearchClient

# Initialize the Azure Maps client
credential = ClientSecretCredential(
    settings.AZURE_TENANT_ID,
    settings.AZURE_CLIENT_ID,
    settings.AZURE_CLIENT_SECRET,
)
maps_client = MapsSearchClient(
    credential=credential,
    client_id=settings.AZURE_MAPS_CLIENT_ID
)

# Define the router
router = Router()

# Define a geocoding function
def geocode_address(address):
    try:
        # Call the Azure Maps Geocoding API
        result = maps_client.get_geocoding(query=address)
        if result and 'features' in result:
            # Extract latitude, longitude, and address details
            first_feature = result['features'][0]
            coordinates = first_feature['geometry']['coordinates']
            longitude, latitude = coordinates[0], coordinates[1]
            address_details = first_feature['properties']['address']['formattedAddress']
            return {
                "latitude": latitude,
                "longitude": longitude,
                "address": address_details,
            }
        else:
            return {"error": "No results found."}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}

# Define the endpoint for geocoding
@router.get("/search/")
def search_address(request, address: str):
    geocode_result = geocode_address(address)
    if "error" in geocode_result:
        return {"error": geocode_result["error"]}
    return geocode_result
'''

from io import UnsupportedOperation
from django.shortcuts import render
import os
import subprocess
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from django.conf import settings
from django.http import JsonResponse
import zipfile

def index(request):
    return render(request,'frontend.html')


# Initialize Ninja API
api = NinjaAPI()

# Directory to temporarily store uploaded shapefiles
UPLOAD_DIR = os.path.join(settings.MEDIA_ROOT, "shapefiles")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@api.get("/test")
def test(request):
    return JsonResponse({"success": True, "message": "test successful."})

@api.post("/upload-shapefile/")
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
        # Clean up temporary files
        os.remove(zip_path)
        for file in zip_ref.namelist():
            os.remove(os.path.join(UPLOAD_DIR, file))
        if os.path.exists(sql_path):
            os.remove(sql_path)
