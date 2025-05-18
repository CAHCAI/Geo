from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class APIReferenceContentTest:
    def __init__(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--log-level=3")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])

        self.service = Service()
        self.driver = webdriver.Chrome(service=self.service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 15)

    def run_test(self):
        try:
            print("\n=== Starting API Reference Content Test ===")

            self.driver.get("http://localhost:5173/")
            self.driver.set_window_size(1920, 1080)
            time.sleep(1.5)

            # Navigate to API Reference page
            api_ref_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'API Reference')]"))
            )
            api_ref_button.click()
            print("✅ Navigated to API Reference")
            time.sleep(2)

            # All sections with expected URL fragments
            sections = [
                {"label": "Geocode", "expected_url": "geocode"},
                {"label": "GetHPSDesignations", "expected_url": "gethpsdesignations"},
                {"label": "TestCache", "expected_url": "testcache"},
                {"label": "ListTables", "expected_url": "list_tables"},
                {"label": "AllDistrictData", "expected_url": "all-district-data"},
                {"label": "Test", "expected_url": "test"},
                {"label": "DevCredentials", "expected_url": "dev_credentials"},
                {"label": "OverrideLocations", "expected_url": "override_locations"},
                {"label": "ManualOverrides", "expected_url": "manual_overrides"},
                {"label": "ManualOverrides/{override_id}", "expected_url": "manual_overrides"},
                {"label": "ActiveSessions", "expected_url": "active_sessions"},
                {"label": "AdminErrors", "expected_url": "admin_errors"},
                {"label": "ApiKeys", "expected_url": "api_keys"},
                {"label": "ServiceStatus", "expected_url": "service_status"},
            ]

            for section in sections:
                try:
                    btn = self.wait.until(
                        EC.element_to_be_clickable(
                            (By.XPATH, f"//button[contains(text(), '{section['label']}')]")
                        )
                    )
                    btn.click()
                    print(f"\n🔍 Checking section: {section['label']}")
                    time.sleep(1.5)

                    # 1. Wait for Example URL block
                    self.wait.until(
                        EC.presence_of_element_located(
                            (By.XPATH, f"//code[contains(text(), '{section['expected_url']}')]")
                        )
                    )
                    print("✅ Example URL found")

                    # 2. Wait for 'key' parameter
                    self.wait.until(
                        EC.presence_of_element_located(
                            (By.XPATH, "//li[contains(text(), 'key')]")
                        )
                    )
                    print("✅ Required parameter 'key' is shown")

                    # 3. Wait for response block to stop saying "Loading"
                    response_xpath = "//pre"
                    self.wait.until(EC.presence_of_element_located((By.XPATH, response_xpath)))
                    response_pre = self.driver.find_element(By.XPATH, response_xpath)

                    # Wait until it no longer says loading
                    WebDriverWait(self.driver, 15).until(
                        lambda d: "loading" not in response_pre.text.lower()
                    )
                    response_text = response_pre.text.strip()
                    assert len(response_text) > 0, "Response block is empty"
                    print("✅ Response block contains data")

                except Exception as e:
                    print(f"❌ Error in section '{section['label']}': {e}")

        except Exception as e:
            print(f"❌ Test setup failed: {e}")
        finally:
            self.driver.quit()
            print("\n=== Content Test Completed & Browser Closed ===")

if __name__ == "__main__":
    test = APIReferenceContentTest()
    test.run_test()
