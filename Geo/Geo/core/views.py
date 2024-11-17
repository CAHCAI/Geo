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

from django.shortcuts import render

def index(request):
    return render(request,'frontend.html')

