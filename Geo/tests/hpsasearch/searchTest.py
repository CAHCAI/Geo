from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class HPSASearchTest:
    def __init__(self):
         #--------------Chrome-------------------
        self.service = Service(executable_path="chromedriver.exe")
        #---------------Microsoft edge-----------
        # self.service = Service(executable_path="msedgedriver.exe")
        #---------------Mozilla firefox--------------
        # self.service = Service(executable_path="geckodriver.exe")

        #--------use google chrome driver--------------
        self.driver = webdriver.Chrome(service=self.service)
        #-------------use firefox driver----------------
        #self.driver = webdriver.Firefox(service=self.service)
        #--------------use edge driver------------------
        # self.driver = webdriver.Edge(service=self.service)

    def _open_and_query(self, coord_str: str):
    
        self.driver.get("http://localhost:5173")

        WebDriverWait(self.driver, 10).until(
        EC.element_to_be_clickable(
            (By.XPATH,
            '//*[@id="root"]/html/body/main/div/nav/div[4]/div/div/button[2]')
            )
        ).click()

        field = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "coordinates-input"))
        )
        field.clear()
        field.send_keys(coord_str)

        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((
                By.XPATH,
                '//*[@id="root"]/html/body/main/div/main/div/div[1]/button'))
        ).click()

        ui = {
            "success_banner": False,
            "no_results_text": False,
            "panels_visible": False,
        }

        try:
            banner = WebDriverWait(self.driver, 8).until(
                EC.visibility_of_element_located(
                    (By.XPATH,
                    '//*[@id="root"]/html/body/main/div/main/div/section/div'))
            )
            ui["success_banner"] = (
                banner.text.strip() == "Search results retrieved successfully."
            )
        except Exception:
            pass 

        try:
            nores = WebDriverWait(self.driver, 1).until(
                EC.visibility_of_element_located((
                    By.XPATH,
                    '//*[@id="root"]/html/body/main/div/main/div/section/div/div'))
            )
            ui["no_results_text"] = (nores.text.strip() == "No results found.")
        except Exception:
            pass  

        if ui["success_banner"]:
            try:
                for xp in (
                    '//*[@id="root"]/html/body/main/div/main/div/div[2]/div',
                    '//*[@id="root"]/html/body/main/div/main/div/div[3]/div',
                ):
                    WebDriverWait(self.driver, 5).until(
                        EC.visibility_of_element_located((By.XPATH, xp))
                    )
                ui["panels_visible"] = True
            except Exception:
                ui["panels_visible"] = False

        return ui

    def run_case(self, lat: float, lng: float, expect_valid: bool):
        coord = f"{lat},{lng}"
        try:
            ui = self._open_and_query(coord)

            if expect_valid and ui["success_banner"] and ui["panels_visible"]:
                print(f"PASS — valid {coord}")
            elif (not expect_valid and ui["no_results_text"]
                  and not ui["panels_visible"]):
                print(f"PASS — invalid {coord} showed “No results found.”")
            else:
                print(f"FAIL — {coord}: {ui}")
        except Exception as e:
            print(f"[ERROR] {coord}: {e}")

    def close(self):
        self.driver.quit()

if __name__ == "__main__":
    tester = HPSASearchTest()

    valid_coords = [
    (34.0522, -118.2437),   
    (37.7749, -122.4194),   
    (32.7157, -117.1611),   
    (38.5816, -121.4944),   

    (37.3382, -121.8863),   
    (35.3733, -119.0187),   
    (34.4208, -119.6982),  
    (40.5865, -122.3917),   
    (33.9806, -117.3755),   
    (38.4405, -122.7144),   
    ]

    invalid_coords = [
    (91.0, 0.0),        
    (-95.0, 0.0),        
    (0.0, 181.0),        
    (0.0, -181.0),        
    (-33.9249, 18.4241),   
    (35.6895, 139.6917),   
    (48.8566, 2.3522),   
    (55.7558, 37.6176),   
    (-34.6037, -58.3816),   
    (19.4326, -99.1332),   
    (0.0, -140.0),      
    (15.0, 35.0),       
    (60.0, -20.0),        
    (-10.0, 110.0),       
    (45.0, 170.0),       
    ]

    print("\n Valid‑coordinate tests")
    for lat, lng in valid_coords:
        tester.run_case(lat, lng, expect_valid=True)
        time.sleep(1)

    print("\n Invalid‑coordinate tests")
    for lat, lng in invalid_coords:
        tester.run_case(lat, lng, expect_valid=False)
        time.sleep(1)

    tester.close()