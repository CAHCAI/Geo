"""
This file contains the models for the Geo app.
ER Diagram: 


"""

from django.db import models

"""
Input: Input for the Geo application
"""

class Input(models.Model):
    input_id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=250)
    source = models.CharField(max_length=100)
    alt_source = models.CharField(max_length=100)
    
    # Return input as a string (the address)
    def __str__(self):
        return str(self.address)

"""
GIS: Geographic Information System
Top level of ER Diagram, takes Input from GEO
"""

# NOTE: Django automatically appends _id to ForeignKeys, but not AutoFields

class GIS(models.Model):
    gis_id = models.AutoField(primary_key=True)
    analysis_type = models.CharField(max_length=100)
    input = models.ForeignKey(Input, on_delete=models.CASCADE)
    
    
"""
Abstract models for reusability across common data model structures
"""

class BaseServiceArea(models.Model):
    source = models.CharField(max_length=100)
    consumer = models.CharField(max_length=100)
    update_frequency = models.CharField(max_length=100)
    last_updated = models.CharField(max_length=100)
    update_process = models.CharField(max_length=100)
    
    class Meta:
        abstract = True     
    
""" 
MSSA: Medical Service Study Area
And sub models:
    MUA: Medically Underserved Area
    MUP: Medically Underserved Population
    PCSA: Primary Care Shortage Area
    RNSA: Registered Nurse Shortage Area
"""

class MSSA(BaseServiceArea):
    mssa_id = models.AutoField(primary_key=True)
    gis = models.ForeignKey(GIS, on_delete=models.CASCADE)
    
# Children of MSSA
    
class MUA(BaseServiceArea):
    mua_id = models.AutoField(primary_key=True)
    mssa = models.ForeignKey(MSSA, on_delete=models.CASCADE)
    
class MUP(BaseServiceArea):
    mup_id = models.AutoField(primary_key=True)
    mssa = models.ForeignKey(MSSA, on_delete=models.CASCADE)
    
class PCSA(BaseServiceArea):
    pcsa_id = models.AutoField(primary_key=True)
    mssa = models.ForeignKey(MSSA, on_delete=models.CASCADE)
    
class RNSA(BaseServiceArea):
    rnsa_id = models.AutoField(primary_key=True)
    mssa = models.ForeignKey(MSSA, on_delete=models.CASCADE)
    

"""
HPSA: Health Professional Shortage Area
And sub models:
    - PrimaryCare
    - MentalHealth
    - DentalHealth
"""

class HPSA(BaseServiceArea):
    hpsa_id = models.AutoField(primary_key=True)
    gis = models.ForeignKey(GIS, on_delete=models.CASCADE)
    
# Children of HPSA

class PrimaryCare(models.Model):
    primary_care_id = models.AutoField(primary_key=True)
    hpsa = models.ForeignKey(HPSA, on_delete=models.CASCADE)
    
class MentalHealth(models.Model):
    mental_health_id = models.AutoField(primary_key=True)
    hpsa = models.ForeignKey(HPSA, on_delete=models.CASCADE)
    
class DentalHealth(models.Model):
    dental_health_id = models.AutoField(primary_key=True)
    hpsa = models.ForeignKey(HPSA, on_delete=models.CASCADE)
    
"""
HSA: Health Service Area
"""

class HSA(BaseServiceArea):
    hsa_id = models.AutoField(primary_key=True)
    gis = models.ForeignKey(GIS, on_delete=models.CASCADE)
    
"""
LASPA: LA Service Planning Area
"""

class LASPA(BaseServiceArea):
    laspa_id = models.AutoField(primary_key=True)
    gis = models.ForeignKey(GIS, on_delete=models.CASCADE)
    

"""
Districts
"""

class Districts(BaseServiceArea):
    district_id = models.AutoField(primary_key=True)
    gis = models.ForeignKey(GIS, on_delete=models.CASCADE)
    
class AssemblyDistrict(models.Model):
    assembly_district_id = models.AutoField(primary_key=True)
    district = models.ForeignKey(Districts, on_delete=models.CASCADE)    
    
class SenateDistrict(models.Model):
    senate_district_id = models.AutoField(primary_key=True)
    district = models.ForeignKey(Districts, on_delete=models.CASCADE)
    
class CongressionalDistrict(models.Model):
    congressional_district_id = models.AutoField(primary_key=True)
    district = models.ForeignKey(Districts, on_delete=models.CASCADE)
    
""" 
HCF: Health Care Facilities
And sub model:
    - DSH: Disproportionate Share Hospital
"""

class HCF(models.Model):
    hcf_id = models.AutoField(primary_key=True)
    source = models.CharField(max_length=100)
    consumer = models.CharField(max_length=100)
    update_frequency = models.CharField(max_length=100)
    last_updated = models.CharField(max_length=100)
    gis = models.ForeignKey(GIS, on_delete=models.CASCADE)
    
class DSH(models.Model):
    dsh_id = models.AutoField(primary_key=True)
    source = models.CharField(max_length=100)
    consumer = models.CharField(max_length=100)
    update_frequency = models.CharField(max_length=100)
    hcf = models.ForeignKey(HCF, on_delete=models.CASCADE)
    
""" 
FQHC: Federally Qualified Health Center / Look Alike
"""

class FQHC(models.Model):
    fqhc_id = models.AutoField(primary_key=True)
    source = models.CharField(max_length=100)
    consumer = models.CharField(max_length=100)
    update_frequency = models.CharField(max_length=100)
    last_updated = models.CharField(max_length=100)
    gis = models.ForeignKey(GIS, on_delete=models.CASCADE)
