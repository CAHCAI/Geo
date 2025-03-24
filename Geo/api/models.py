from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
import secrets
from datetime import timedelta, datetime, timezone
from django.contrib.gis.db import models 
from django.contrib.auth.hashers import make_password
from datetime import timedelta, datetime



# Create your models here.

"""
# gis model example
class ShapeFileModel(models.Model):
    name = models.CharField(max_length=255)  # Example attribute
    geom = models.GeometryField()  # Supports all geometry types (Point, LineString, Polygon, etc.)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
"""

# GIS Assembly District Model
class AssemblyDistrict(models.Model):
    id = models.AutoField(primary_key=True)
    district_number = models.IntegerField()  # DISTRICT field
    area = models.FloatField()  # AREA field
    members = models.IntegerField(null=True, blank=True)  # MEMBERS field
    population = models.IntegerField()  # POPULATION field
    cvap_19 = models.IntegerField()  # CVAP_19 field
    hsp_cvap_1 = models.IntegerField()  # HSP_CVAP_1 field
    doj_nh_blk = models.IntegerField()  # DOJ_NH_BLK field
    doj_nh_asn = models.IntegerField()  # DOJ_NH_ASN field
    nh_wht_cva = models.IntegerField()  # NH_WHT_CVA field
    ideal_value = models.FloatField()  # IDEAL_VALU field
    deviation = models.FloatField()  # DEVIATION field
    f_deviatio = models.FloatField()  # F_DEVIATIO FIELD
    f_cvap_19 = models.FloatField()  # F_CVAP_19 field
    f_hsp_cvap = models.FloatField()  # F_HSP_CVAP field
    f_doj_nh_b = models.FloatField()  # F_DOJ_NH_B field
    f_doj_nh_a = models.FloatField()  # F_DOJ_NH_A field
    f_nh_wht_c = models.FloatField()  # F_NH_WHT_C field
    district_n = models.IntegerField(null=True)  # DISTRICT_N
    district_label = models.CharField(max_length=50, null=True, blank=True)  # DISTRICT_L
    geom = models.MultiPolygonField()  # Stores MultiPolygon geometry

    def __str__(self):
        return f"Assembly District {self.district_number}"


# GIS Senate District Model
class SenateDistrict(models.Model):
    id = models.AutoField(primary_key=True)
    district_number = models.IntegerField()  # DISTRICT field
    area = models.FloatField()  # AREA field
    members = models.IntegerField(null=True, blank=True)  # MEMBERS field
    population = models.IntegerField()  # POPULATION field
    cvap_19 = models.IntegerField()  # CVAP_19 field
    hsp_cvap_1 = models.IntegerField()  # HSP_CVAP_1 field
    doj_nh_ind = models.IntegerField(null=True)  # DOJ_NH_IND field
    doj_nh_blk = models.IntegerField()  # DOJ_NH_BLK field
    doj_nh_asn = models.IntegerField()  # DOJ_NH_ASN field
    nh_wht_c = models.IntegerField()  # NH_WHT_C field
    ideal_value = models.FloatField()  # IDEAL_VALU field
    deviation = models.FloatField()  # DEVIATION field
    f_deviation = models.FloatField()  # F_DEVIATION FIELD
    f_cvap_19 = models.FloatField()  # F_CVAP_19 field
    f_hsp_cvap_1 = models.FloatField()  # F_HSP_CVAP_1 field
    f_doj_nh_b = models.FloatField()  # F_DOJ_NH_B field
    f_doj_nh_a = models.FloatField()  # F_DOJ_NH_A field
    f_nh_wht_c = models.FloatField()  # F_NH_WHT_C field
    district_label = models.CharField(max_length=50, null=True, blank=True)  # DISTRICT_L
    multiple_f = models.CharField(max_length=50, null=True, blank=True)  # MULTIPLE_F field
    geom = models.MultiPolygonField()  # Stores MultiPolygon geometry

    def __str__(self):
        return f"Senate District {self.district_number}"

# GIS Congressional District Model
class CongressionalDistrict(models.Model):
    id = models.AutoField(primary_key=True)
    district_number = models.IntegerField()  # DISTRICT field
    area = models.FloatField()  # AREA field
    members = models.IntegerField(null=True, blank=True)  # MEMBERS field
    population = models.IntegerField()  # POPULATION field
    cvap_19 = models.IntegerField()  # CVAP_19 field
    hsp_cvap_1 = models.IntegerField()  # HSP_CVAP_1 field
    doj_nh_blk = models.IntegerField()  # DOJ_NH_BLK field
    doj_nh_asn = models.IntegerField()  # DOJ_NH_ASN field
    nh_wht_cva = models.IntegerField()  # NH_WHT_CVA field
    ideal_value = models.FloatField()  # IDEAL_VALU field
    deviation = models.FloatField()  # DEVIATION field
    f_deviatio = models.FloatField()  # F_DEVIATIO field
    multiple_f = models.CharField(max_length=50, null=True, blank=True)  # MULTIPLE_F field
    f_cvap_19 = models.FloatField()  # F_CVAP_19 field
    f_hsp_cvap = models.FloatField()  # F_HSP_CVAP field
    f_doj_nh_b = models.FloatField()  # F_DOJ_NH_B field
    f_doj_nh_a = models.FloatField()  # F_DOJ_NH_A field
    f_nh_wht_c = models.FloatField()  # F_NH_WHT_C field
    district_label = models.CharField(max_length=50, null=True, blank=True)  # DISTRICT_L
    district_n = models.IntegerField(null=True)  # DISTRICT_N
    geom = models.MultiPolygonField()  # Stores MultiPolygon geometry

    def __str__(self):
        return f"Congressional District {self.district_number}"
    
# GIS PrimaryCareShortageArea Model
class PrimaryCareShortageArea(models.Model):
    fid = models.AutoField(primary_key=True) # FID
    objectid = models.IntegerField() # OBJECTID
    unit_count = models.IntegerField() # UNIT_COUNT
    cnty_fips = models.CharField(max_length=10) # CNTY_FIPS
    mssa_id = models.CharField(max_length=10) # MSSA_ID
    definition = models.CharField(max_length=25) # DEFINITION
    area_sqmi = models.FloatField() # AREA_SQMI
    mssa_count = models.CharField(max_length=40) # MSSA_COUNT
    mssa_name = models.CharField(max_length=200) # MSSA_NAME
    total_popu = models.IntegerField() # Total_Popu
    est_physic = models.FloatField() # EST_Physic
    est_fnppa = models.FloatField() # EST_FNPPA
    est_provid = models.FloatField() # EST_Provid
    provider_r = models.FloatField() # Provider_R
    score_prov = models.IntegerField() # Score_Pove
    pop_fpl = models.IntegerField() # Pop_100FPL
    pct_fpl = models.FloatField() # PCT_100FPL
    score_pove = models.IntegerField() # Score_Pove
    score_tota = models.IntegerField() # Score_Tota
    pcsa = models.CharField(max_length=5) # PCSA
    effective = models.DateField() # Effective
    shape_are = models.FloatField() # Shape__Are
    shape_len = models.FloatField() # Shape__Len
    geom = models.MultiPolygonField() # Stores MultiPolygon geometry
    
    
# GIS LA Service Planning Area Model (LA-SPA)
class LAServicePlanningArea(models.Model):
    spa = models.IntegerField(primary_key=True) # SPA
    spa_num = models.CharField(max_length=10) # SPA_NUM
    spa_name = models.CharField(max_length=25) # SPA_NAME
    shape_star = models.FloatField() # SHAPE_STAr
    shape_stle = models.FloatField() # SHAPE_STLe
    geom = models.MultiPolygonField() # Stores MultiPolygon geometry
    
    def __str__(self):
        return f"LA Service Planning Area {self.spa_name}"
    
# Medical Service Study Area (MSSA)
class MedicalServiceStudyArea(models.Model):
    fid = models.BigIntegerField(primary_key=True) # FID
    statefp = models.CharField(max_length=10) # STATEFP
    countyfp = models.CharField(max_length=10) # COUNTYFP
    county_nm = models.CharField(max_length=100) # COUNTYNM
    tractce = models.CharField(max_length=20) # TRACTCE
    geoid = models.CharField(max_length=50) # GEOID
    aland = models.FloatField() # ALAND
    awater = models.FloatField() # AWATER
    asqmi = models.FloatField() # ASQMI
    intptlat = models.FloatField() # INTPTLAT
    intptlon = models.FloatField() # INTPTLON
    mssaid = models.CharField(max_length=20, null=True) # MSSAID
    mssanm = models.CharField(max_length=400, null=True) # MSSANM
    definition = models.CharField(max_length=20, null=True) # DEFINITION
    totalpovpo = models.BigIntegerField() # TOTALPOVPO
    shape_area = models.FloatField() # Shape__Are
    shape_len = models.FloatField() # Shape__Len
    geom = models.MultiPolygonField() # Stores MultiPolygon geometry
        
# Registered Nurse Shortage Area (RNSA)
class RegisteredNurseShortageArea(models.Model):
    rn_area_id = models.IntegerField(primary_key=True) # RN_Area_ID
    trial_rn_a = models.IntegerField() # Trial_RN_A
    shape_leng = models.FloatField() # Shape_Leng
    shape_area = models.FloatField() # Shape_Area
    rn_area_na = models.CharField(max_length=100) # RN_Area_Na
    population = models.IntegerField() # Population
    rn_lic = models.IntegerField() # RN_LIC
    rm_emprate = models.FloatField() # RN_EMPRATE
    employed_r = models.IntegerField() # Employed_R
    ratio = models.FloatField() # Ratio
    target_rat = models.IntegerField() # Target_Rat
    rnsa = models.CharField(max_length=5) # RNSA
    severity = models.CharField(max_length=10, null=True) # Severity
    effective = models.DateField() # Effective_
    geom = models.MultiPolygonField() # Stores MultiPolygon geometry
    
    def __str__(self):
        return f"Registered Nurse Shortage Area {self.rn_area_na}"
    
# Health Service Area (HSA)
class HealthServiceArea(models.Model):
    count = models.IntegerField() # COUNT_
    hsa_number = models.IntegerField(primary_key=True) # HSA_NUMBER
    hsa_code = models.CharField(max_length=5) # HSA_CODE
    hsa_name = models.CharField(max_length=50) # HSA_NAME
    area_sqmi = models.FloatField() # AREA_SQMI
    pop2000 = models.FloatField() # POP2000
    popdensity = models.FloatField() # POPDENSITY
    shape_star = models.FloatField() # SHAPE_STAr
    shape_stle = models.FloatField() # SHAPE_STLe
    geom = models.MultiPolygonField() # Stores MultiPolygon geometry
    
    def __str__(self):
        return f"Health Service Area: {self.hsa_name}"

class HealthProfessionalShortageArea(models.Model):
    hpsa_name = models.CharField(max_length=255, null=True, blank=True)
    hpsa_id = models.CharField(max_length=50, null=True, blank=True)
    designation_type = models.CharField(max_length=100, null=True, blank=True)
    hpsa_discipline_class = models.CharField(max_length=100, null=True, blank=True)
    hpsa_score = models.IntegerField(null=True, blank=True)
    primary_state_abbreviation = models.CharField(max_length=10, null=True, blank=True)
    hpsa_status = models.CharField(max_length=50, null=True, blank=True)
    hpsa_designation_date = models.DateField(null=True, blank=True)
    hpsa_designation_last_update_date = models.DateField(null=True, blank=True)
    metropolitan_indicator = models.CharField(max_length=50, null=True, blank=True)
    hpsa_geography_id = models.CharField(max_length=50, null=True, blank=True)
    hpsa_degree_of_shortage = models.CharField(max_length=50, null=True, blank=True)
    withdrawn_date = models.DateField(null=True, blank=True)
    hpsa_fte = models.FloatField(null=True, blank=True)
    hpsa_designation_population = models.IntegerField(null=True, blank=True)
    percent_population_below_poverty = models.FloatField(null=True, blank=True)
    hpsa_formal_ratio = models.CharField(max_length=50, null=True, blank=True)
    hpsa_population_type = models.CharField(max_length=100, null=True, blank=True)
    rural_status = models.CharField(max_length=50, null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    common_county_name = models.CharField(max_length=100, null=True, blank=True)
    common_postal_code = models.CharField(max_length=20, null=True, blank=True)
    common_state_name = models.CharField(max_length=100, null=True, blank=True)
    county_equivalent_name = models.CharField(max_length=100, null=True, blank=True)
    provider_type = models.CharField(max_length=100, null=True, blank=True)
    hpsa_provider_ratio_goal = models.CharField(max_length=50, null=True, blank=True)
    hpsa_resident_civilian_population = models.IntegerField(null=True, blank=True)
    hpsa_shortage = models.CharField(max_length=50, null=True, blank=True)
    hpsa_status_code = models.CharField(max_length=50, null=True, blank=True)
    hpsa_type_code = models.CharField(max_length=50, null=True, blank=True)
    hpsa_withdrawn_date_string = models.CharField(max_length=50, null=True, blank=True)
    primary_state_fips_code = models.CharField(max_length=10, null=True, blank=True)
    state_fips_code = models.CharField(max_length=10, null=True, blank=True)
    state_name = models.CharField(max_length=100, null=True, blank=True)
    us_mexico_border_100km_indicator = models.CharField(max_length=10, null=True, blank=True)
    us_mexico_border_county_indicator = models.CharField(max_length=10, null=True, blank=True)
    data_warehouse_record_create_date = models.DateField(null=True, blank=True)

    class Meta:
        abstract = True


class HPSA_DentalHealthShortageArea(HealthProfessionalShortageArea):
    pass


class HPSA_MentalHealthShortageArea(HealthProfessionalShortageArea):
    pass


class HPSA_PrimaryCareShortageArea(HealthProfessionalShortageArea):
    pc_mcta_score = models.IntegerField(null=True, blank=True)


def generate_api_key():
    return str(uuid.uuid4()).replace('-', '')  # Generates a unique API key


# APIKey model
class APIKey(models.Model):
    key = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # Ensure this exists
    usage_count = models.IntegerField(default=0)
    revoked = models.BooleanField(default=False)

    def is_valid(self):
        """ Check if the API key is valid (not expired or revoked) """
        if self.revoked:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True

    def increment_usage(self, limit=100):
        """ Increment the usage count and revoke if it exceeds limit """
        self.usage_count += 1
        if self.usage_count >= limit:
            self.revoke()
        self.save()

    def revoke(self):
        """ Revoke the API key """
        self.revoked = True
        self.save()

    @classmethod
    def generate(cls, expires_in_days=30):
        """ Generate a new API key with expiration """
        return cls.objects.create(
            key=secrets.token_hex(32),
            expires_at=timezone.make_aware(datetime.now() + timedelta(days=expires_in_days))  # Timezone-aware
        )

    def __str__(self):
        return f"{self.key} ({self.ip_address})"



class OverrideLocation(models.Model):
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.address
    
class AdminErrors(models.Model):
    id = models.AutoField(primary_key=True)
    error_code = models.IntegerField()
    error_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.error_description
