from django.db import models
from django.contrib.gis.db import models

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
    name = models.CharField()
    population = models.IntegerField()  # POPULATION field
    cvap_19 = models.IntegerField()  # CVAP_19 field
    hsp_cvap_1 = models.IntegerField()  # HSP_CVAP_1 field
    doj_nh_ind = models.IntegerField(null=True)  # DOJ_NH_IND field
    doj_nh_blk = models.IntegerField()  # DOJ_NH_BLK field
    doj_nh_asn = models.IntegerField()  # DOJ_NH_ASN field
    nh_wht_cva = models.IntegerField(null=True, blank=True)  # NH_WHT_C field
    ideal_valu = models.FloatField()  # IDEAL_VALU field
    deviation = models.FloatField()  # DEVIATION field
    f_deviatio = models.FloatField()  # F_DEVIATION FIELD
    f_cvap_19 = models.FloatField()  # F_CVAP_19 field
    f_hsp_cvap = models.FloatField()  # F_HSP_CVAP_1 field
    f_doj_nh_i = models.FloatField()
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
    f_deviatio = models.FloatField()  # F_DEVIATIO FIELD
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
