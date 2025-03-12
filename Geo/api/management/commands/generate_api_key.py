from django.core.management.base import BaseCommand
from api.models import APIKey

class Command(BaseCommand):
    help = "Generate a new API key"

    def add_arguments(self, parser):
        parser.add_argument("ip_address", type=str, help="IP address associated with the API key")

    def handle(self, *args, **options):
        ip_address = options["ip_address"]
        api_key = APIKey.objects.create(ip_address=ip_address)
        self.stdout.write(self.style.SUCCESS(f"New API Key: {api_key.key} (IP: {api_key.ip_address})"))
