@echo off
REM Automatically create a Django superuser with predefined credentials and display the output

REM Define the username and password
set USERNAME=admin
set PASSWORD=admin123

REM Run the inline Python script to create the superuser
echo Running createsuperuser...
docker exec -it geo_backend python -c "
from django.contrib.auth import get_user_model;
USERNAME = '%USERNAME%';
PASSWORD = '%PASSWORD%';
User = get_user_model();
if not User.objects.filter(username=USERNAME).exists():
    User.objects.create_superuser(username=USERNAME, password=PASSWORD);
    print(f'SuperUser created successfully!');
else:
    print(f'SuperUser with username \"{USERNAME}\" already exists.');
" > superuser_output.txt

REM Display the output to the user
echo Superuser created with the following credentials:
echo Username: %USERNAME%
echo Password: %PASSWORD%

REM Clean up the temporary output file
del superuser_output.txt