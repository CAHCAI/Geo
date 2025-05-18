from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class APIReferenceTest:
    def __init__(self):
        self.service = Service()  
        self.driver = webdriver.Chrome(service=self.service)
        self.wait = WebDriverWait(self.driver, 15)

    def run_test(self):
        try:
            print("\n=== Starting API Reference Test ===")
            self.driver.get("http://localhost:5173/")
            self.driver.set_window_size(1920, 1080)
            time.sleep(1.5)

            # Step 1: Navigate to API Reference
            print("🔎 Looking for API Reference in navbar...")
            api_ref_button = self.wait.until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//*[contains(text(), 'API Reference')]")
                )
            )
            api_ref_button.click()
            time.sleep(2)

            # Step 2: Confirm API Reference page loaded
            self.wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//h2[contains(text(), 'API Reference')]")
                )
            )
            print("✅ API Reference page loaded")

            # Step 3: Test all sections
            section_labels = [
                "Geocode",
                "GetHPSDesignations",
                "TestCache",
                "ListTables",
                "AllDistrictData",
                "Test",
                "DevCredentials",
                "OverrideLocations",
                "ManualOverrides",
                "ManualOverrides",
                "ActiveSessions",
                "AdminErrors",
                "ApiKeys",
                "ServiceStatus",
            ]

            for label in section_labels:
                try:
                    btn = self.wait.until(
                        EC.element_to_be_clickable(
                            (By.XPATH, f"//button[contains(text(), '{label}')]")
                        )
                    )
                    btn.click()
                    print(f"✅ Clicked section: {label}")
                    time.sleep(0.5)
                except Exception as e:
                    print(f"❌ Could not click section '{label}': {e}")

        except Exception as e:
            print(f"❌ Test failed: {e}")
        finally:
            self.driver.quit()
            print("\n=== Test Completed & Browser Closed ===")

if __name__ == "__main__":
    test = APIReferenceTest()
    test.run_test()
