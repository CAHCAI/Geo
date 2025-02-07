import zipfile
import os
from tempfile import TemporaryDirectory
from osgeo import ogr
from django.contrib.gis.gdal import DataSource
from api.models import SenateDistrict, CongressionalDistrict, AssemblyDistrict
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import MultiPolygon, Polygon

def extract_zip(file: str) -> TemporaryDirectory:
    """
    Extracts provided zip file to a temporary directory
    """
    tmp_dir = TemporaryDirectory()  # Create temp directory without context manager
    with zipfile.ZipFile(file, 'r') as zip_ref:
        zip_ref.extractall(tmp_dir.name)  # Use tmp_dir.name to access the path
    return tmp_dir  # Return the TemporaryDirectory object itself

def find_shapefile(directory: str) -> str | None: # type: ignore
    """
    Recursively locate the first .shp file in the given directory.
    """
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".shp"):
                return os.path.join(root, file)
    return None

def get_shapefile_metadata(shapefile_path: str) -> list[str]:
    """
    Get all field metadata for a given shapefile path
    """
    data_source = ogr.Open(shapefile_path)
    layer = data_source.GetLayer()
    fields = [field.name for field in layer.schema]
    return fields

def identify_shapefile_type(fields: list[str]) -> str:
    """
    Identifies the type of shapefile based on its fields.
    Ensures more specific conditions are checked before general ones.
    """
    # Congressional-specific fields
    if 'DISTRICT_N' in fields and 'MULTIPLE_F' in fields:
        return 'congressional'

    # Senate-specific fields
    if 'DOJ_NH_IND' in fields and 'F_CVAP_19' in fields and 'DISTRICT_L' in fields:
        return 'senate'

    # Assembly-specific fields
    if 'DISTRICT_L' in fields and 'HSP_CVAP_1' in fields and 'NH_WHT_CVA' in fields:
        return 'assembly'

    return 'unknown'

def get_shapefile_layer(shapefile_path: str) -> DataSource:
    """
    Opens the shapefile and retrieves its layer.
    """
    data_source = DataSource(shapefile_path)
    if len(data_source) == 0:
        raise ValueError("No layers found in the shapefile.")
    return data_source[0]  # Return the first layer

def get_geos_geometry(geometry: ogr.Geometry) -> MultiPolygon:
    """
    Converts an OGR geometry to a GEOS MultiPolygon.
    """
    # Convert geometry to MultiPolygon if it's a Polygon
    # This is needed because our PostGIS DB can only store one or the other, not both in a column

    # Convert GDAL geometry to GEOSGeometry
    geos_geometry = GEOSGeometry(geometry.wkt)

    # Ensure the geometry is a MultiPolygon
    if isinstance(geos_geometry, Polygon):
        geos_geometry = MultiPolygon(geos_geometry)  # Convert Polygon to MultiPolygon
    elif not isinstance(geos_geometry, MultiPolygon):
        raise TypeError(f"Unsupported geometry type: {type(geos_geometry)}")

    return geos_geometry

# upload functions
def upload_senate_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Senate shapefile layer to the database.
    """
    # Get field definitions from the layer
    field_names = layer.fields

    for feature in layer:
        # Create a dictionary to map field names to values
        attributes = {field_name: feature.get(field_name) for field_name in field_names}
        geometry = feature.geom

        # Convert GDAL geometry to GEOSGeometry
        geos_geometry = get_geos_geometry(geometry)

        # Populate the SenateDistrict model
        SenateDistrict.objects.create(
            district_number=attributes['DISTRICT'],  
            area=attributes['AREA'],
            members=attributes.get('MEMBERS'),  # Use .get() if optional
            population=attributes['POPULATION'],
            cvap_19=attributes['CVAP_19'],
            hsp_cvap_1=attributes['HSP_CVAP_1'],
            doj_nh_blk=attributes['DOJ_NH_BLK'],
            doj_nh_asn=attributes['DOJ_NH_ASN'],
            nh_wht_c=attributes['NH_WHT_CVA'],  
            ideal_value=attributes['IDEAL_VALU'],
            deviation=attributes['DEVIATION'],
            f_deviation=attributes['F_DEVIATIO'],  
            f_cvap_19=attributes['F_CVAP_19'],
            f_hsp_cvap_1=attributes['F_HSP_CVAP'],
            f_doj_nh_b=attributes['F_DOJ_NH_B'],
            f_doj_nh_a=attributes['F_DOJ_NH_A'],
            f_nh_wht_c=attributes['F_NH_WHT_C'],
            district_label=attributes['DISTRICT_L'],
            geom=geos_geometry,  
        )

def upload_congressional_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Congressional shapefile layer to the database.
    """
    # Get field definitions from the layer
    field_names = layer.fields

    for feature in layer:
        # Create a dictionary to map field names to values
        attributes = {field_name: feature.get(field_name) for field_name in field_names}
        geometry = feature.geom

        # Convert GDAL geometry to GEOSGeometry and ensure it is a MultiPolygon
        geos_geometry = get_geos_geometry(geometry)

        # Populate the CongressionalDistrict model
        CongressionalDistrict.objects.create(
            district_number=attributes['DISTRICT_N'],  
            area=attributes['AREA'],
            members=attributes.get('MEMBERS'),  # Use .get() if optional
            population=attributes['POPULATION'],
            cvap_19=attributes['CVAP_19'],
            hsp_cvap_1=attributes['HSP_CVAP_1'],
            doj_nh_blk=attributes['DOJ_NH_BLK'],
            doj_nh_asn=attributes['DOJ_NH_ASN'],
            nh_wht_cva=attributes['NH_WHT_CVA'],  
            ideal_value=attributes['IDEAL_VALU'],
            deviation=attributes['DEVIATION'],
            f_deviatio=attributes['F_DEVIATIO'],
            multiple_f=attributes.get('MULTIPLE_F'),  # Optional
            f_cvap_19=attributes['F_CVAP_19'],
            f_hsp_cvap=attributes['F_HSP_CVAP'],
            f_doj_nh_b=attributes['F_DOJ_NH_B'],
            f_doj_nh_a=attributes['F_DOJ_NH_A'],
            f_nh_wht_c=attributes['F_NH_WHT_C'],
            district_label=attributes['DISTRICT_L'],
            geom=geos_geometry,
        )

def upload_assembly_shapefile(layer: DataSource) -> None:
    """
    Uploads data from an Assembly shapefile layer to the database.
    """
    # Get field definitions from the layer
    field_names = layer.fields

    for feature in layer:
        # Create a dictionary to map field names to values
        attributes = {field_name: feature.get(field_name) for field_name in field_names}
        geometry = feature.geom

        # Convert GDAL geometry to GEOSGeometry and ensure it is a MultiPolygon
        geos_geometry = get_geos_geometry(geometry)

        # Populate the AssemblyDistrict model
        AssemblyDistrict.objects.create(
            district_number=attributes['DISTRICT'],  
            area=attributes['AREA'],
            members=attributes.get('MEMBERS'),   # Use .get() if optional
            population=attributes['POPULATION'],
            cvap_19=attributes['CVAP_19'],
            hsp_cvap_1=attributes['HSP_CVAP_1'],
            doj_nh_blk=attributes['DOJ_NH_BLK'],
            doj_nh_asn=attributes['DOJ_NH_ASN'],
            nh_wht_cva=attributes['NH_WHT_CVA'],  
            ideal_value=attributes['IDEAL_VALU'],
            deviation=attributes['DEVIATION'],
            f_deviatio=attributes['F_DEVIATIO'],  
            f_cvap_19=attributes['F_CVAP_19'],
            f_hsp_cvap=attributes['F_HSP_CVAP'],
            f_doj_nh_b=attributes['F_DOJ_NH_B'],
            f_doj_nh_a=attributes['F_DOJ_NH_A'],
            f_nh_wht_c=attributes['F_NH_WHT_C'],
            district_label=attributes['DISTRICT_L'],
            geom=geos_geometry,
        )

