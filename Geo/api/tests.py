from django.test import TestCase
from GEO.models import AssemblyDistrict, SenateDistrict, CongressionalDistrict
from GEO.forms import YourForm
from django.urls import reverse, resolve
from GEO.views import home_view
from django.contrib.gis.gdal import DataSource  # GeoDjango's tool for reading shapefiles
from django.contrib.gis.utils import LayerMapping
from django.db import connection
from ninja import NinjaAPI
from .views import admin_login, admin_logout
from .routers import router
from django.contrib.auth.models import User
import json


# THIS IS A BEGINNING TEMPLATE FOR FUTURE TESTING
# Create your tests here.

# Model tests go here

# Assembly District Models Test Case
class AssemblyDistrictTest(TestCase):
    def setUp(self):
        """Setup test data before each test."""
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
        self.assertEqual(response.status_code, 200)  # Replace with expected status code
        
        response = self.client.get(reverse('admin_logout'))  # Tests logout view URL
        self.assertEqual(response.status_code, 200)  # Replace with expected status code

        # Test if Ninja API URLs are properly accessible
        response = self.client.get(reverse('admin_login'))  # Add path from your urlpatterns
        self.assertEqual(response.status_code, 200)
        
        # You can also test the router paths if needed
        # Assuming router is set to '/api/'
        response = self.client.get('/api/')  # Replace '/api/' with the actual path if different
        self.assertEqual(response.status_code, 200)  # Check if the response is as expected


# Form tests go here (currently have no forms)
class YourFormTest(TestCase):
    def test_valid_form(self):
        """Test if form is valid with correct data."""
        form = YourForm(data={"field_name": "Valid Data"})
        self.assertTrue(form.is_valid())

    def test_invalid_form(self):
        """Test if form is invalid with missing data."""
        form = YourForm(data={})
        self.assertFalse(form.is_valid())
