from ast import parse
import zipfile
import os
from tempfile import TemporaryDirectory
from osgeo import ogr
from django.contrib.gis.gdal import DataSource
from api.models import HealthServiceArea, LAServicePlanningArea, MedicalServiceStudyArea, PrimaryCareShortageArea, RegisteredNurseShortageArea, SenateDistrict, CongressionalDistrict, AssemblyDistrict
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import MultiPolygon, Polygon
from django.db import connection
from django.db import transaction
import tempfile
from Geo.cache import cache
import csv

from datetime import datetime

def parse_date(date_str):
    """
    Given a string like '10/20/2005' or '2005-10-20',
    return a Python date object (or None if invalid/empty).
    """
    if not date_str:
        return None
    
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            pass
    
    return None

import tempfile
from datetime import datetime
from django.db import connection, transaction
from .models import (
    HPSA_DentalHealthShortageArea,
    HPSA_MentalHealthShortageArea,
    HPSA_PrimaryCareShortageArea
)

def parse_float(value: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0

def handle_csv_upload(uploaded_file):
    """
    Saves the uploaded file to disk, then processes it with handle_csv.
    """
    print("inside handle_csv_upload")
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            for chunk in uploaded_file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name  # The path to the saved file

        return handle_csv(tmp_path)
    except Exception as e:
        print(e)
        
def parse_shared_hpsa_fields(row):
    return {
        "hpsa_name": row.get("HPSA Name", ""),
        "hpsa_id": row.get("HPSA ID", ""),
        "designation_type": row.get("Designation Type", ""),
        "hpsa_discipline_class": row.get("HPSA Discipline Class", ""),
        "hpsa_score": int(row.get("HPSA Score", "0") or 0),
        "primary_state_abbreviation": row.get("Primary State Abbreviation", ""),
        "hpsa_status": row.get("HPSA Status", ""),
        "hpsa_designation_date": parse_date(row.get("HPSA Designation Date", "")),
        "hpsa_designation_last_update_date": parse_date(row.get("HPSA Designation Last Update Date", "")),
        "metropolitan_indicator": row.get("Metropolitan Indicator", ""),
        "hpsa_geography_id": row.get("HPSA Geography Identification Number", ""),
        "hpsa_degree_of_shortage": row.get("HPSA Degree of Shortage", ""),
        "withdrawn_date": parse_date(row.get("Withdrawn Date", "")),
        "hpsa_fte": parse_float(row.get("HPSA FTE", "0")),
        "hpsa_designation_population": int(float(row.get("HPSA Designation Population", "0") or 0)),
        "percent_population_below_poverty": parse_float(row.get("% of Population Below 100% Poverty", "0")),
        "hpsa_formal_ratio": row.get("HPSA Formal Ratio", ""),
        "hpsa_population_type": row.get("HPSA Population Type", ""),
        "rural_status": row.get("Rural Status", ""),
        "longitude": parse_float(row.get("Longitude", "0")),
        "latitude": parse_float(row.get("Latitude", "0")),
        "common_county_name": row.get("Common County Name", ""),
        "common_postal_code": row.get("Common Postal Code", ""),
        "common_state_name": row.get("Common State Name", ""),
        "county_equivalent_name": row.get("County Equivalent Name", ""),
        "provider_type": row.get("Provider Type", ""),
        "hpsa_provider_ratio_goal": row.get("HPSA Provider Ratio Goal", ""),
        "hpsa_resident_civilian_population": int(float(row.get("HPSA Resident Civilian Population", "0") or 0)),
        "hpsa_shortage": row.get("HPSA Shortage", ""),
        "hpsa_status_code": row.get("HPSA Status Code", ""),
        "hpsa_type_code": row.get("HPSA Type Code", ""),
        "hpsa_withdrawn_date_string": row.get("HPSA Withdrawn Date String", ""),
        "primary_state_fips_code": row.get("Primary State FIPS Code", ""),
        "state_fips_code": row.get("State FIPS Code", ""),
        "state_name": row.get("State Name", ""),
        "us_mexico_border_100km_indicator": row.get("U.S. - Mexico Border 100 Kilometer Indicator", ""),
        "us_mexico_border_county_indicator": row.get("U.S. - Mexico Border County Indicator", ""),
        "data_warehouse_record_create_date": parse_date(row.get("Data Warehouse Record Create Date", ""))
    }



def handle_csv(file_path):
    """
    Reads a CSV file, determines the HPSA discipline (dental, mental, primary)
    from 'HPSA Discipline Class', and then does a bulk insert into the DB.
    
    This approach:
      1) Reads every row and sorts them into separate lists by discipline
      2) For each discipline that actually has data, we TRUNCATE once
      3) Bulk insert the rows for that discipline
    """
    print("handling csv file")
    try:
        # Separate lists for each discipline
        dental_rows = []
        mental_rows = []
        primary_rows = []

        # Read CSV
        with open(file_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                discipline_class = row.get("HPSA Discipline Class", "").lower()
                shared_fields = parse_shared_hpsa_fields(row)

                if "dental" in discipline_class:
                    instance = HPSA_DentalHealthShortageArea(**shared_fields)
                    dental_rows.append(instance)
                elif "mental" in discipline_class:
                    instance = HPSA_MentalHealthShortageArea(**shared_fields)
                    mental_rows.append(instance)
                elif "primary" in discipline_class:
                    instance = HPSA_PrimaryCareShortageArea(**shared_fields)
                    primary_rows.append(instance)

        # Now bulk-insert for each discipline that actually has data.
        # We also TRUNCATE each table only once per discipline.
        with transaction.atomic():
            if dental_rows:
                with connection.cursor() as cursor:
                    cursor.execute(f'TRUNCATE TABLE "{HPSA_DentalHealthShortageArea._meta.db_table}" CASCADE')
                HPSA_DentalHealthShortageArea.objects.bulk_create(dental_rows, batch_size=1000)
                print(f"Inserted {len(dental_rows)} dental rows.")

            if mental_rows:
                with connection.cursor() as cursor:
                    cursor.execute(f'TRUNCATE TABLE "{HPSA_MentalHealthShortageArea._meta.db_table}" CASCADE')
                HPSA_MentalHealthShortageArea.objects.bulk_create(mental_rows, batch_size=1000)
                print(f"Inserted {len(mental_rows)} mental rows.")

            if primary_rows:
                with connection.cursor() as cursor:
                    cursor.execute(f'TRUNCATE TABLE "{HPSA_PrimaryCareShortageArea._meta.db_table}" CASCADE')
                HPSA_PrimaryCareShortageArea.objects.bulk_create(primary_rows, batch_size=1000)
                print(f"Inserted {len(primary_rows)} primary rows.")

    except Exception as e:
        print(f"Error in handle_csv: {e}")


def to_dict(dist):
    return {
        "district_number": dist.district_number,
        "district_label": dist.district_label,
        "population": dist.population,
        # Other information here if needed
    }

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
    if 'PCSA' in fields:
        return 'pcsa'
    if 'SPA' in fields:
        return 'laspa'
    if 'MSSAID' in fields:
        return 'mssa'
    if 'RNSA' in fields:
        return 'rnsa'
    if 'HSA_NUMBER' in fields:
        return 'hsa'
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
    Fixes projection issues if coordinates are stored in the wrong projection.
    """

    geos_geometry = GEOSGeometry(geometry.wkt)

    # Detect if coordinates are likely in Web Mercator by bounding box
    # EPSG:4326 should have lon between -180 and 180, lat between -90 and 90
    minx, miny, maxx, maxy = geos_geometry.extent
    if abs(minx) > 180 or abs(maxx) > 180 or abs(miny) > 90 or abs(maxy) > 90:
        # Stored in meters, but marked as 4326 — assume it's actually EPSG:3857
        geos_geometry.srid = 3857
        geos_geometry.transform(4326)  # Fix projection

    if isinstance(geos_geometry, Polygon):
        geos_geometry = MultiPolygon(geos_geometry)
    elif not isinstance(geos_geometry, MultiPolygon):
        raise TypeError(f"Unsupported geometry type: {type(geos_geometry)}")

    return geos_geometry

# generalized uploader follows these steps:
# 1. attempt to create Django model instances for all of the data
# 2. if this is successful, truncate the existing data table
# 3. finally, we save the records to the db table
def generic_shapefile_uploader(layer: DataSource, model, create_instance_func, label: str) -> None:
    """
    Generalized uploader for shapefile layers.
    
    Parameters:
      layer: The DataSource layer from the shapefile.
      model: The Django model class for insertion.
      create_instance_func: Callable that takes (attributes, geos_geometry)
                            and returns a model instance.
      label: A string label for logging (e.g., "Senate").
    """
    field_names = layer.fields
    temp_records = []
    
    print(f"Testing {label} insertion...")
    # Loop over features, build instance, and store in a temporary list.
    for feature in layer:
        attributes = {field: feature.get(field) for field in field_names}
        geometry = feature.geom
        geos_geometry = get_geos_geometry(geometry)
        try:
            obj = create_instance_func(attributes, geos_geometry)
            temp_records.append(obj)
        except Exception as e:
            print(f"Error inserting feature: {e}")
            return  # Exit if any feature fails
    
    print("All test inserts passed. Truncating table...")
    with connection.cursor() as cursor:
        cursor.execute(f'TRUNCATE TABLE "{model._meta.db_table}" CASCADE')
    
    print("Re-inserting valid records...")
    try:
        for obj in temp_records:
            obj.save()
    except Exception as e:
        print(f"Error saving object: {e}")
        return
    
    print(f"Successfully inserted {len(temp_records)} records into {label}.")
    # flush cache after successful shapefile upload
    cache.flushdb()
    
    
def upload_senate_shapefile(layer: DataSource) -> None:
    """Uploads Senate shapefile layer using the generic uploader."""
    def create_instance(attributes, geos_geometry):
        return SenateDistrict(
            district_number=attributes['DISTRICT'],
            area=attributes['AREA'],
            members=attributes.get('MEMBERS'),
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
            geom=geos_geometry
        )
    generic_shapefile_uploader(layer, SenateDistrict, create_instance, "Senate")

def upload_congressional_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Congressional shapefile layer to the database using the generic uploader.
    """    
    def create_instance(attributes, geos_geometry):
        return CongressionalDistrict(
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
            geom=geos_geometry
        )
    generic_shapefile_uploader(layer, CongressionalDistrict, create_instance, "Congressional")

def upload_assembly_shapefile(layer: DataSource) -> None:
    """
    Uploads data from an Assembly shapefile layer to the database using the generic uploader.
    """
    def create_instance(attributes, geos_geometry):
        return AssemblyDistrict(
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
            geom=geos_geometry
        )
    generic_shapefile_uploader(layer, AssemblyDistrict, create_instance, "Assembly")
        
def upload_laspa_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Los Angeles Service Planning Area shapefile layer to the database using the generic uploader.
    """
    def create_instance(attributes, geos_geometry):
        return LAServicePlanningArea(
            spa=attributes.get('SPA'),
            spa_num=attributes.get('SPA_NUM'),
            spa_name=attributes.get('SPA_NAME'),
            shape_star=attributes.get('SHAPE_STAr'),
            shape_stle=attributes.get('SHAPE_STLe'),
            geom=geos_geometry,
        )
    generic_shapefile_uploader(layer, LAServicePlanningArea, create_instance, "laspa")

def upload_hsa_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Health Service Area shapefile layer to the database.
    """
    def create_instance(attributes, geos_geometry):
        return HealthServiceArea(
            count = attributes['COUNT_'],
            hsa_number = attributes['HSA_NUMBER'],
            hsa_code = attributes['HSA_CODE'],
            hsa_name = attributes['HSA_NAME'],
            area_sqmi = attributes['AREA_SQMI'],
            pop2000 = attributes['POP2000'],
            popdensity = attributes['POPDENSITY'],
            shape_star = attributes['SHAPE_STAr'],
            shape_stle = attributes['SHAPE_STLe'],
            geom = geos_geometry
        )
    generic_shapefile_uploader(layer, HealthServiceArea, create_instance, "hsa")

def upload_rnsa_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Registered Nurse Shortage Area shapefile layer to the database.
    """
    def create_instance(attributes, geos_geometry):
        return RegisteredNurseShortageArea(
            rn_area_id = attributes['RN_Area_ID'],
            trial_rn_a = attributes['Trial_RN_A'],
            shape_leng = attributes['Shape_Leng'],
            shape_area = attributes['Shape_Area'],
            rn_area_na = attributes['RN_Area_Na'],
            population = attributes['Population'],
            rn_lic = attributes['RN_LIC'],
            rm_emprate = attributes['RN_EMPRATE'],
            employed_r = attributes['Employed_R'],
            ratio = attributes['Ratio'],
            target_rat = attributes['Target_Rat'],
            rnsa = attributes['RNSA'],
            severity = attributes['Severity'],
            effective = attributes['Effective_'],
            geom = geos_geometry
        )
    generic_shapefile_uploader(layer, RegisteredNurseShortageArea, create_instance, "rnsa")

    
def upload_mssa_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Medical Service Study Area shapefile layer to the database.
    """
    def create_instance(attributes, geos_geometry):
        return MedicalServiceStudyArea(
            fid = attributes['FID'],
            statefp = attributes['STATEFP'],
            countyfp = attributes['COUNTYFP'],
            county_nm = attributes['COUNTYNM'],
            tractce = attributes['TRACTCE'],
            geoid = attributes['GEOID'],
            aland = attributes['ALAND'],
            awater = attributes['AWATER'],
            asqmi = attributes['ASQMI'],
            intptlat = attributes['INTPTLAT'],
            intptlon = attributes['INTPTLON'],
            mssaid = attributes['MSSAID'],
            mssanm = attributes['MSSANM'],
            definition = attributes['DEFINITION'],
            totalpovpo = attributes['TOTALPOVPO'],
            shape_area = attributes['Shape__Are'],
            shape_len = attributes['Shape__Len'],
            geom = geos_geometry
        )
    generic_shapefile_uploader(layer, MedicalServiceStudyArea, create_instance, "mssa")
    
def upload_pcsa_shapefile(layer: DataSource) -> None:
    """
    Uploads data from a Primary Care Shortage Area shapefile layer to the database.
    """
    def create_instance(attributes, geos_geometry):
        return PrimaryCareShortageArea(
            fid = attributes['FID'],
            objectid = attributes['OBJECTID'],
            unit_count = attributes['UNIT_COUNT'],
            cnty_fips = attributes['CNTY_FIPS'],
            mssa_id = attributes['MSSA_ID'],
            definition = attributes['DEFINITION'],
            area_sqmi = attributes['AREA_SQMI'],
            mssa_count = attributes['MSSA_COUNT'],
            mssa_name = attributes['MSSA_NAME'],
            total_popu = attributes['Total_Popu'],
            est_physic = attributes['EST_Physic'],
            est_fnppa = attributes['EST_FNPPA'],
            est_provid = attributes['EST_Provid'],
            provider_r = attributes['Provider_R'],
            score_prov = attributes['Score_Pove'],
            pop_fpl = attributes['Pop_100FPL'],
            pct_fpl = attributes['PCT_100FPL'],
            score_pove = attributes['Score_Pove'],
            score_tota = attributes['Score_Tota'],
            pcsa = attributes['PCSA'],
            effective = attributes['Effective'],
            shape_are = attributes['Shape__Are'],
            shape_len = attributes['Shape__Len'],
            geom = geos_geometry
        )
    generic_shapefile_uploader(layer, PrimaryCareShortageArea, create_instance, "pcsa")


    