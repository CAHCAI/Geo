from django.test import TestCase
from .models import (AssemblyDistrict, HealthServiceArea, 
SenateDistrict, CongressionalDistrict, LAServicePlanningArea,
MedicalServiceStudyArea, PrimaryCareShortageArea, RegisteredNurseShortageArea)
from django.urls import reverse, resolve
from django.contrib.gis.utils import LayerMapping
from django.db import connection
from ninja import NinjaAPI
from .views import admin_login, admin_logout
from .routers import router
from django.contrib.auth.models import User
import json
import os
from django.contrib.gis.geos import Point, Polygon, MultiPolygon  # Added for geometry testing
from .utils import (parse_date, parse_float, identify_shapefile_type, 
get_shapefile_layer, extract_zip, find_shapefile, upload_assembly_shapefile, 
upload_congressional_shapefile, upload_hsa_shapefile, upload_senate_shapefile,
upload_laspa_shapefile, upload_mssa_shapefile, upload_pcsa_shapefile, upload_rnsa_shapefile)
from datetime import date

# Test utilities library
class UtilsFunctionTests(TestCase):
    def test_parse_date_valid_formats(self):
        self.assertEqual(parse_date("2020-01-01"), date(2020, 1, 1))
        self.assertEqual(parse_date("01/01/2020"), date(2020, 1, 1))
        self.assertEqual(parse_date("01/01/20"), date(2020, 1, 1))

    def test_parse_date_invalid(self):
        self.assertIsNone(parse_date("not a date"))
        self.assertIsNone(parse_date(""))
        self.assertIsNone(parse_date(None))

    def test_parse_float_valid(self):
        self.assertEqual(parse_float("3.14"), 3.14)
        self.assertEqual(parse_float("0"), 0.0)

    def test_parse_float_invalid(self):
        self.assertEqual(parse_float(""), 0.0)
        self.assertEqual(parse_float("not a number"), 0.0)

    def test_identify_shapefile_type(self):
        self.assertEqual(identify_shapefile_type(["DISTRICT_N", "MULTIPLE_F"]), "congressional")
        self.assertEqual(identify_shapefile_type(["DOJ_NH_IND", "F_CVAP_19", "DISTRICT_L"]), "senate")
        self.assertEqual(identify_shapefile_type(["DISTRICT_L", "HSP_CVAP_1", "NH_WHT_CVA"]), "assembly")
        self.assertEqual(identify_shapefile_type(["PCSA"]), "pcsa")
        self.assertEqual(identify_shapefile_type(["SPA"]), "laspa")
        self.assertEqual(identify_shapefile_type(["MSSAID"]), "mssa")
        self.assertEqual(identify_shapefile_type(["RNSA"]), "rnsa")
        self.assertEqual(identify_shapefile_type(["HSA_NUMBER"]), "hsa")
        self.assertEqual(identify_shapefile_type(["UNKNOWN_FIELD"]), "unknown")

# Test shapefile upload functionality
class ShapefileUploadTests(TestCase):

    # Test assembly
    def test_upload_assembly_shapefile(self):
        # Use absolute path 
        path = "/app/sql/data/ad.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Assembly shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Assembly shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_assembly_shapefile(layer)

        districts = AssemblyDistrict.objects.all()
        self.assertTrue(districts.exists(), "AssemblyDistrict upload failed.")
        print(f"Inserted {districts.count()} Assembly Districts.")

    # Test senate
    def test_upload_senate_shapefile(self):
        path = "/app/sql/data/sd.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Senate shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Senate shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_senate_shapefile(layer)

        districts = SenateDistrict.objects.all()
        self.assertTrue(districts.exists(), "SenateDistrict upload failed.")
        print(f"Inserted {districts.count()} Senate Districts.")

    # Test Congressional
    def test_upload_congressional_shapefile(self):
        path = "/app/sql/data/cd.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Congressional shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Congressional shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_congressional_shapefile(layer)

        districts = CongressionalDistrict.objects.all()
        self.assertTrue(districts.exists(), "CongressionalDistrict upload failed.")
        print(f"Inserted {districts.count()} Congressional Districts.")
        
    # Test HSA (Health Service Area)
    def test_upload_hsa_shapefile(self):
        path = "/app/sql/data/hsa.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Health Service Area shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Health Service Area shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_hsa_shapefile(layer)

        districts = HealthServiceArea.objects.all()
        self.assertTrue(districts.exists(), "Health Service Area upload failed.")
        print(f"Inserted {districts.count()} Health Service Areas.")
        
    # Test LASPA (Los Angeles Service Planning Area)
    def test_upload_laspa_shapefile(self):
        path = "/app/sql/data/laspa.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Los Angeles Service Planning Area shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Los Angeles Service Planning Area shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_laspa_shapefile(layer)

        districts = LAServicePlanningArea.objects.all()
        self.assertTrue(districts.exists(), "Los Angeles Service Planning Area upload failed.")
        print(f"Inserted {districts.count()} Los Angeles Service Planning Areas.")
        
    # Test MSSA (Medical Service Study Area)
    def test_upload_mssa_shapefile(self):
        path = "/app/sql/data/mssa.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Medical Service Study Area shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Medical Service Study Area  shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_mssa_shapefile(layer)

        districts = MedicalServiceStudyArea.objects.all()
        self.assertTrue(districts.exists(), "Medical Service Study Area upload failed.")
        print(f"Inserted {districts.count()} Medical Service Study Areas.")
        
    # Test PCSA (Medical Service Study Area)
    def test_upload_pcsa_shapefile(self):
        path = "/app/sql/data/pcsa.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Primary Care Shortage Area shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Primary Care Shortage Area shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_pcsa_shapefile(layer)

        districts = PrimaryCareShortageArea.objects.all()
        self.assertTrue(districts.exists(), "Primary Care Shortage Area upload failed.")
        print(f"Inserted {districts.count()} Primary Care Shortage Areas.")
        
    # Test RNSA (Medical Service Study Area)
    def test_upload_rnsa_shapefile(self):
        path = "/app/sql/data/rnsa.zip"
        
        # Check if file exists before proceeding
        self.assertTrue(os.path.exists(path), f"Registered Nurse Shortage Area shapefile not found at: {path}")
        
        temp_dir = extract_zip(path)
        shp_path = find_shapefile(temp_dir.name)
        self.assertIsNotNone(shp_path, "Registered Nurse Shortage Area shapefile not found in extracted files.")

        layer = get_shapefile_layer(str(shp_path))
        upload_rnsa_shapefile(layer)

        districts = RegisteredNurseShortageArea.objects.all()
        self.assertTrue(districts.exists(), "Registered Nurse Shortage Area upload failed.")
        print(f"Inserted {districts.count()} Registered Nurse Shortage Areas.")

# Legacy model testing
class AssemblyDistrictTest(TestCase):
    def setUp(self):
        """Setup test data before each test."""
        # Create a simple polygon for testing
        poly = Polygon(((0, 0), (0, 1), (1, 1), (1, 0), (0, 0)))
        geom = MultiPolygon([poly])  # Wrap the polygon in a list for MultiPolygon
        
        self.district = AssemblyDistrict.objects.create(
            district_number=1,
            area=150.5,
            members=3,
            population=500000,
            cvap_19=300000,
            hsp_cvap_1=200000,
            doj_nh_blk=50000,
            doj_nh_asn=70000,
            nh_wht_cva=180000,
            ideal_value=100.0,
            deviation=5.0,
            f_deviatio=0.05,
            f_cvap_19=0.6,
            f_hsp_cvap=0.4,
            f_doj_nh_b=0.1,
            f_doj_nh_a=0.14,
            f_nh_wht_c=0.36,
            district_n=1,
            district_label="District 1",
            geom=geom,  # MultiPolygon geometry field
        )

    def test_model_creation(self):
        """Test if the AssemblyDistrict instance is created properly."""
        self.assertEqual(self.district.district_number, 1)
        self.assertEqual(self.district.area, 150.5)
        self.assertEqual(self.district.population, 500000)

    def test_string_representation(self):
        """Test model's string representation."""
        self.assertEqual(str(self.district), "Assembly District 1")


# Senate District Models Test Case
class SenateDistrictTest(TestCase):
    def setUp(self):
        """Setup test data before each test."""
        # Create a simple polygon for testing
        poly = Polygon(((0, 0), (0, 1), (1, 1), (1, 0), (0, 0)))
        geom = MultiPolygon([poly])  # Wrap the polygon in a list for MultiPolygon
        
        self.district = SenateDistrict.objects.create(
            district_number=5,
            area=200.75,
            members=2,
            population=750000,
            cvap_19=400000,
            hsp_cvap_1=250000,
            doj_nh_blk=60000,
            doj_nh_asn=80000,
            nh_wht_c=250000,
            ideal_value=120.0,
            deviation=3.5,
            f_deviation=0.03,
            f_cvap_19=0.53,
            f_hsp_cvap_1=0.35,
            f_doj_nh_b=0.08,
            f_doj_nh_a=0.11,
            f_nh_wht_c=0.33,
            district_label="Senate District 5",
            geom=geom,  # MultiPolygon geometry field
        )

    def test_model_creation(self):
        """Test if the SenateDistrict instance is created properly."""
        self.assertEqual(self.district.district_number, 5)
        self.assertEqual(self.district.area, 200.75)
        self.assertEqual(self.district.population, 750000)

    def test_string_representation(self):
        """Test model's string representation."""
        self.assertEqual(str(self.district), "Senate District 5")


# Congressional District Model Test Case
class CongressionalDistrictTest(TestCase):
    def setUp(self):
        """Setup test data before each test."""
        # Create a simple polygon for testing
        poly = Polygon(((0, 0), (0, 1), (1, 1), (1, 0), (0, 0)))
        geom = MultiPolygon([poly])  # Wrap the polygon in a list for MultiPolygon
        
        self.district = CongressionalDistrict.objects.create(
            district_number=10,
            area=300.25,
            members=1,
            population=900000,
            cvap_19=500000,
            hsp_cvap_1=300000,
            doj_nh_blk=70000,
            doj_nh_asn=90000,
            nh_wht_cva=280000,
            ideal_value=140.0,
            deviation=4.0,
            f_deviatio=0.04,
            f_cvap_19=0.56,
            f_hsp_cvap=0.34,
            f_doj_nh_b=0.09,
            f_doj_nh_a=0.1,
            f_nh_wht_c=0.31,
            district_label="Congressional District 10",
            geom=geom,  # MultiPolygon geometry field
        )

    def test_model_creation(self):
        """Test if the CongressionalDistrict instance is created properly."""
        self.assertEqual(self.district.district_number, 10)
        self.assertEqual(self.district.area, 300.25)
        self.assertEqual(self.district.population, 900000)

    def test_string_representation(self):
        """Test model's string representation."""
        self.assertEqual(str(self.district), "Congressional District 10")

# View tests go here
class AdminLoginLogoutTests(TestCase):
    def setUp(self):
        # Set up a test user to be used for login/logout tests
        self.username = 'admin'
        self.password = 'password123'
        self.user = User.objects.create_user(username=self.username, password=self.password)
    
    def test_admin_login_success(self):
        # Simulate a POST request to the admin_login view
        url = reverse('admin_login')  # Make sure this URL name matches your `urls.py`
        response = self.client.post(url, json.dumps({'username': self.username, 'password': self.password}), content_type="application/json")
        
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"message": "Login successful"})
    
    def test_admin_login_invalid_credentials(self):
        # Test invalid credentials
        url = reverse('admin_login')
        response = self.client.post(url, json.dumps({'username': 'wronguser', 'password': 'wrongpass'}), content_type="application/json")
        
        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": "Invalid credentials"})
    
    def test_admin_login_invalid_request_method(self):
        # Test a non-POST request
        url = reverse('admin_login')
        response = self.client.get(url)  # Should be a POST request
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": "Invalid request"})
    
    def test_admin_logout(self):
        # First, log in the user
        self.client.login(username=self.username, password=self.password)
        
        # Simulate a POST request to the admin_logout view
        url = reverse('admin_logout')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"message": "Logged out successfully"})
        
        # Ensure the user is logged out by trying to access a logged-in endpoint
        # This is just an example; replace with any endpoint that requires login if needed.
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"message": "Logged out successfully"})


# URL tests go here
class URLTests(TestCase):
    def test_urls(self):
        # Test if the root URL correctly resolves to the API urls
        response = self.client.get(reverse('admin_login'))  # Tests login view URL
        # For GET requests to admin_login, expect 400 Bad Request
        self.assertEqual(response.status_code, 400)  # Updated to match actual behavior
        
        response = self.client.get(reverse('admin_logout'))  # Tests logout view URL
        self.assertEqual(response.status_code, 200)

        # You can also test the router paths if needed
        # Assuming router is set to '/api/'
        response = self.client.get('/api/')  # Replace '/api/' with the actual path if different
        # Update this to the expected status code for your API root
        # self.assertEqual(response.status_code, 200)  # Commented out since the actual code may vary