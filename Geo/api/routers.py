import os
from shutil import rmtree
import subprocess
import zipfile
from django.conf import settings
from django.http import JsonResponse
from ninja import Router, File
from ninja.files import UploadedFile
from django.db import connection

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

#GET data from all tables
@router.get("/all-tables-data")
def all_tables_data(request):
    """
    Fetches all rows from multiple tables and returns a 
    dict {table_name: [row dict, row dict, ...], ...}.
    """
    # The tables that it pulls from (Change if too much)
    tables = [
        "assembly_layers",
        "assembly_shape_table",
        "boe_layers",
        "congressional_layers",
        "congressional_shape_table",
        "senate_layers",
        "senate_shape_table",
        "spatial_ref_sys",
    ]

    results = {}

    with connection.cursor() as cursor:
        for table_name in tables:
            try:
                # Select all rows
                cursor.execute(f"SELECT * FROM {table_name}")
                columns = [desc[0] for desc in cursor.description]
                rows = cursor.fetchall()

                # Convert each row to a dict
                table_data = []
                for row in rows:
                    row_dict = dict(zip(columns, row))
                    table_data.append(row_dict)

                results[table_name] = table_data

            except Exception as e:
                # If there's an error (e.g., table doesn't exist), store the error
                results[table_name] = {"error": str(e)}

    return JsonResponse(results)