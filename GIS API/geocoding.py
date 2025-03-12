import os
from azure.identity import ClientSecretCredential  
from azure.maps.search import MapsSearchClient  
from dotenv import load_dotenv  

#Loading environment variables from a .env file
load_dotenv()

#Getting the sensitive credentials from the environment variables
client_id = os.getenv("AZURE_CLIENT_ID")
tenant_id = os.getenv("AZURE_TENANT_ID")
client_secret = os.getenv("AZURE_CLIENT_SECRET")
azure_maps_client_id = os.getenv("AZURE_MAPS_CLIENT_ID")

#Authenticating using service principal credentials 
credential = ClientSecretCredential(tenant_id, client_id, client_secret)

#Initializing the Azure Maps Search client with credentials 
maps_client = MapsSearchClient(
    credential=credential,
    client_id=azure_maps_client_id
)

#Geocoding and getting latitude, longitude, and address
def geocode_address(address):
    try:
        #Using the get_geocoding method of the MapsSearchClient to geocode the given address
        result = maps_client.get_geocoding(query=address)

        #Checking if the response contains 'features', because it holds the geocoding data
        if result and 'features' in result:
            #Getting the first feature (result) from the response
            first_feature = result['features'][0]

            #Removing the coordinates (longitude, latitude) from the geometry of the feature
            coordinates = first_feature['geometry']['coordinates']
            longitude, latitude = coordinates[0], coordinates[1]

            #Printing the extracted latitude and longitude
            print(f"Latitude: {latitude}, Longitude: {longitude}")

            #Printing the full formatted address from the response
            address_details = first_feature['properties']['address']['formattedAddress']
            print(f"Address: {address_details}")
        else:
            #If no results are found, notify the user
            print("No results found.")
    except Exception as e:
        #Handling any exceptions that occur during the API call or response parsing
        print(f"An error occurred: {e}")

#Reverse geocoding and getting address from latitude and longitude
def reverse_geocode_coordinates(latitude, longitude):
    try:
        #Using the get_reverse_geocoding method of the MapsSearchClient to reverse geocode the given coordinates
        result = maps_client.get_reverse_geocoding(coordinate=(latitude, longitude))

        #Checking if the response contains 'address', because it holds the reverse geocoding data
        if result and 'address' in result:
            #Printing the full formatted address from the response
            address_details = result['address']['formattedAddress']
            print(f"Address: {address_details}")
        else:
            #If no results are found, notify the user
            print("No results found.")
    except Exception as e:
        #Handling any exceptions that occur during the API call or response parsing
        print(f"An error occurred: {e}")

#Testing
address = "6000 Jed Smith Dr, Sacramento, CA"
geocode_address(address)

latitude = 38.576572
longitude = -121.493985
reverse_geocode_coordinates(latitude, longitude)
