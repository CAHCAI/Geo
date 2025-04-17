# Dockerfile for Django backend
# Use the official Python image
FROM python:3.10

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies for shp2pgsql (PostGIS tools) and PostgreSQL client
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    postgresql-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files into the container
COPY . /app/

# Create the directory for SQL data
RUN mkdir -p /app/sql/data

# Expose the Django development server port
EXPOSE 8000

# Start Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]