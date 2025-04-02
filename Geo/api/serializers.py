# myapp/serializers.py

from rest_framework import serializers
from .models import OverrideLocation, APIKey

class OverrideLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverrideLocation
        fields = ('id', 'address', 'latitude', 'longitude')


class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = ['key', 'app_name', 'usage_count', 'revoked', 'created_at']
        read_only_fields = ['key', 'usage_count', 'revoked', 'created_at']
