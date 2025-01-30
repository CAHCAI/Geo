import os
import requests

# API Endpoint
API_URL = "http://localhost:8000/upload-shapefile/"

# Directory where shapefiles are stored
DATA_DIR = "sql/data"

# List of shapefiles to upload
FILES = ["ad.zip", "cd.zip", "sd.zip"]

def upload_file(file_path):
    """Uploads a single file to the API."""
    with open(file_path, "rb") as file:
        response = requests.post(API_URL, files={"file": file})
        return response

def main():
    """Uploads all shapefiles in the list."""
    for file_name in FILES:
        file_path = os.path.join(DATA_DIR, file_name)

        if not os.path.isfile(file_path):
            print(f"File not found: {file_path}")
            continue

        print(f"Uploading {file_name}...")
        response = upload_file(file_path)

        if response.status_code == 200:
            print(f"{file_name} uploaded successfully! Response: {response.json()}")
        else:
            print(f"Failed to upload {file_name}. Status: {response.status_code}, Response: {response.text}")

    print("Uploads complete!")

if __name__ == "__main__":
    main()
