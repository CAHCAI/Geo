# auth documentation: https://django-ninja.dev/guides/authentication/

from xxlimited import Str
from ninja import Router, NinjaAPI, Form
from ninja.security import APIKeyHeader

# Authentication API Key
class APIKeyAuth(APIKeyHeader):
    # Direct from the docs:
    # Note: param_name is the name of the GET parameter that will be checked for. If not set, the default of "key" will be used.
    param_name = "X-API-Key"

    def authenticate(self, request, key):
        if key == "supersecret":
            return key

    
    

