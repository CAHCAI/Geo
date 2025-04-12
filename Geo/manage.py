#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def create_superuser():
    """Automatically create a superuser if it doesn't exist."""
    import django
    from django.contrib.auth.models import User

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Geo.settings')
    django.setup()

    SUPERUSER_USERNAME = 'admin'
    SUPERUSER_PASSWORD = 'admin123'

    if not User.objects.filter(username=SUPERUSER_USERNAME).exists():
        User.objects.create_superuser(
            username=SUPERUSER_USERNAME,
            password=SUPERUSER_PASSWORD
        )
        print(f"Superuser created successfully!")
        print(f"Username: {SUPERUSER_USERNAME}")
        print(f"Password: {SUPERUSER_PASSWORD}")
    else:
        print("Superuser already exists.")


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Geo.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # Automatically create superuser when running the server
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        create_superuser()

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()