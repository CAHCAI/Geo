from django.test import TestCase
from django.contrib.auth import get_user_model

class SuperUserCreationTest(TestCase):
    def test_superuser_creation(self):
        """ Test whether a superuser is created successfully with predefined credentials. """
        
        # Define the username and password
        username = "admin"
        password = "admin123"

        # Get the User model
        User = get_user_model()

        # Check if the superuser already exists
        if not User.objects.filter(username=username).exists():
            # Create the superuser
            User.objects.create_superuser(username=username, password=password)
            print(f"SuperUser created successfully with username: {username}")
        else:
            print(f"SuperUser with username '{username}' already exists.")

        # Assert that the superuser now exists
        self.assertTrue(User.objects.filter(username=username, is_superuser=True).exists())