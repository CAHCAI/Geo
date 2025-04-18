from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class HealthcareFacilitiesTest:
    def __init__(self):
       
        self.service = Service(executable_path="msedgedriver.exe")  # or chromedriver/geckodriver
        self.driver = webdriver.Edge(service=self.service)
        self.wait = WebDriverWait(self.driver, 15) 
      

    def navigate_to_facilities(self):
        try:
            self.driver.get("http://localhost:5173/")
            
            
            button = WebDriverWait(self.driver, 15).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(concat(' ', normalize-space(@class), ' '), ' hover:bg-black ') and text()='Licensed Healthcare Facilities']")
                )
            )
            button.click()
            
         
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//table[.//th[contains(., 'Facility')]]"))
            )
            time.sleep(1)  

        except Exception as e:
            print(f"Navigation failed: {e}")
            self.driver.quit()
            exit()

    def validate_table_functionality(self):
        print("\n=== Starting Comprehensive Table Validation ===")
        
      
        try:
            rows = self.driver.find_elements(By.XPATH, "//table/tbody/tr")
            print(f"✅ Initial load - {len(rows)} rows displayed")
            assert len(rows) == 20, "Incorrect initial row count"
        except Exception as e:
            print(f"❌ Data load failed: {e}")
            return

      
        try:
            self._test_column_search("Search Alias", "Memorial", 3)
            self._test_column_search("Search Facility", "Hospital", 15)
        except Exception as e:
            print(f"❌ Search failed: {e}")

       
        try:
            self._test_pagination()
        except Exception as e:
            print(f"❌ Pagination failed: {e}")

       
        try:
            self._validate_boolean_values()
        except Exception as e:
            print(f"❌ Boolean validation failed: {e}")

    def _test_column_search(self, placeholder, search_term, min_results):
        search_input = self.driver.find_element(
            By.XPATH, f"//input[@placeholder='{placeholder}']"
        )
        search_input.clear()
        search_input.send_keys(search_term)
        time.sleep(1.5)  

        visible_rows = self.driver.find_elements(By.XPATH, "//table/tbody/tr")
        print(f"✅ '{search_term}' search - {len(visible_rows)} results")
        assert len(visible_rows) >= min_results, "Insufficient filtered results"

      
        for i in range(1, min(4, len(visible_rows) + 1)): 
            row_cells = self.driver.find_elements(By.XPATH, f"//table/tbody/tr[{i}]/td")
            row_contains_term = any(
                search_term.lower() in cell.text.lower() for cell in row_cells
            )
            assert row_contains_term, f"Search term '{search_term}' not found in row {i}"

    def _test_pagination(self):
     
        page_info = self.driver.find_element(
            By.XPATH, "//span[contains(text(),'Page')]").text
        initial_page = int(page_info.split()[1])
        total_pages = int(page_info.split()[3])

        if total_pages > 1:
            
            next_btn = self.wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//button[contains(text(),'Next')]")
            ))
            next_btn.click()
            time.sleep(1)
            
            new_page = int(self.driver.find_element(
                By.XPATH, "//span[contains(text(),'Page')]").text.split()[1]
            )
            assert new_page == initial_page + 1, "Next page failed"

        
            prev_btn = self.wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//button[contains(text(),'Previous')]")
            ))
            prev_btn.click()
            time.sleep(1)
            
            final_page = int(self.driver.find_element(
                By.XPATH, "//span[contains(text(),'Page')]").text.split()[1]
            )
            assert final_page == initial_page, "Previous page failed"
            print("✅ Pagination working")
        else:
            print("⚠️ Pagination test skipped - single page")

    def _validate_boolean_values(self):
      
        for row in range(1, 6):
            teaching = self.driver.find_element(
                By.XPATH, f"//table/tbody/tr[{row}]/td[10]").text.lower()
            rural = self.driver.find_element(
                By.XPATH, f"//table/tbody/tr[{row}]/td[11]").text.lower()
            dsh = self.driver.find_element(
                By.XPATH, f"//table/tbody/tr[{row}]/td[12]").text.lower()
            
            assert teaching in ["true", "false"], "Invalid Teaching Hospital value"
            assert rural in ["true", "false"], "Invalid Rural Hospital value"
            assert dsh in ["true", "false"], "Invalid DSH value"
        print("✅ Boolean formatting consistent")

    def close(self):
        self.driver.quit()

if __name__ == "__main__":
    tester = HealthcareFacilitiesTest()
    tester.navigate_to_facilities()
    tester.validate_table_functionality()
    tester.close()
    print("\n=== Test Sequence Completed ===")