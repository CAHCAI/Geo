# myapp/serializers.py

from rest_framework import serializers
from .models import OverrideLocation

class OverrideLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverrideLocation
        fields = ('id', 'address', 'latitude', 'longitude')
