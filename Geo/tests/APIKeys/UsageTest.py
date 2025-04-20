import requests
import json

def test_validate_api_key(api_key):
    url = "http://localhost:8000/api/validate-api-key/"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "api_key": api_key
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        print(f"Request sent to {url}")
        print(f"Payload: {payload}")
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            print("API key is valid and request was accepted.")
        elif response.status_code == 400:
            print("Bad request. Possibly malformed or missing field.")
        elif response.status_code == 401:
            print("Unauthorized. API key may be invalid or revoked.")
        else:
            print(f"Unexpected response: {response.text}")

        print("Response Body:")
        print(response.text)

    except Exception as e:
        print(f"Error occurred during request: {e}")

if __name__ == "__main__":
    test_validate_api_key("5ef7797fed89d07e15490d2116be45224098339feb2a23c70cad7fd1d97b8f87e80605dd47c85095af6a74eb03cd8f499b04193d79e3ebd3f8aae57a7824e02a")
