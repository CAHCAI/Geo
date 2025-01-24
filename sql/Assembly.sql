--This is the initial data table for the GEO app for the ASSEMBLY layers
CREATE TABLE assembly_layers (
    --identifies a record
    FID INTEGER PRIMARY KEY, 
    --type of shape
    SHAPE VARCHAR(20),
    --unique identifier (another pk)
    ID INTEGER UNIQUE,  
    --area of district in squre miles              
    AREA NUMERIC(9, 2),     
    --district number              
    DISTRICT VARCHAR(12),  
    --member assigned to disctrict               
    MEMBERS NUMERIC(7, 2),  
    --locked geography              
    LOCKED VARCHAR(1),  
    --district name                  
    NAMES VARCHAR(43),  
    --total population                   
    POPULATIONS BIGINT,      
    --citizen voting age              
    CVAP_19 BIGINT, 
    --citizen voting age hispanic                      
    HSP_CVAP_1 BIGINT,    
    --race: black                
    DOJ_NH_BLK BIGINT,  
    --race: asian                  
    DOJ_NH_ASN BIGINT, 
    --citizen voting: neither hispanic nor asian                   
    NH_WHT_CVA BIGINT,    
    --ideal voting age population                
    IDEAL_VALU NUMERIC(11, 4),  
    --deviation from ideal district size         
    DEVIATION NUMERIC(11, 4),      
    --% deviation from ideal district size       
    F_DEVIATIO NUMERIC(11, 4), 
    --% totalcitizen voting age population           
    F_CVAP_19 NUMERIC(11, 4),  
    --% citizen voting age: hispanic or latino           
    F_HSP_CVAP NUMERIC(11, 4),    
    --% citizen not hispani or latino      
    F_DOJ_NH_B NUMERIC(11, 4),  
    --% citizen voting not hispanic or latino - only black          
    F_DOJ_NH_A NUMERIC(11, 4),   
    --% citizen voting not hispani or latino - only asian           
    F_NH_WHT_C NUMERIC(11, 4), 
    -- district number           
    DISTRICT_N BIGINT,   
    --district label                 
    DISTRICT_L VARCHAR(12)                
);
