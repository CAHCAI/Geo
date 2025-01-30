import os
import requests

# API Endpoint
API_URL = "http://localhost:8000/api/upload-shapefile/"

# Directory where shapefiles are stored
DATA_DIR = "sql/data"

# List of shapefiles to upload
FILES = ["ad.zip", "cd.zip", "sd.zip"]

def upload_file(file_path):
    """Uploads a file using a streaming approach to optimize speed."""
    with open(file_path, "rb") as file:
        response = requests.post(API_URL, files={"file": (file_path, file, "application/zip")}, stream=True, timeout=30)
        return response

def main():
    """Uploads all shapefiles efficiently."""
    with requests.Session() as session:  # Reuse the connection
        for file_name in FILES:
            file_path = os.path.join(DATA_DIR, file_name)

            if not os.path.isfile(file_path):
                print(f"❌ File not found: {file_path}")
                continue

            print(f"Uploading {file_name}...")
            response = session.post(API_URL, files={"file": open(file_path, "rb")}, stream=True, timeout=60)

            if response.status_code == 200:
                print(f"{file_name} uploaded successfully! Response: {response.json()}")
            else:
                print(f"Failed to upload {file_name}. Status: {response.status_code}, Response: {response.text}")

    print("Uploads complete!")

if __name__ == "__main__":
    main()
