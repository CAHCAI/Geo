from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class TestDockerContainerStatus(unittest.TestCase):
    def setUp(self):
        # Set up the Selenium WebDriver (e.g., ChromeDriver)
        self.driver = webdriver.Chrome()  # Ensure you have the ChromeDriver installed and in PATH
        self.driver.get("http://localhost:8080")  # Replace with the URL of your Docker monitoring interface

    def test_container_status(self):
        driver = self.driver

        try:
            # Wait for the container status table to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "container-status-table"))  # Replace with the actual ID or selector
            )

            # Locate the container status table
            table = driver.find_element(By.ID, "container-status-table")  # Replace with the actual ID or selector

            # Verify the table contains expected container information
            rows = table.find_elements(By.TAG_NAME, "tr")
            self.assertGreater(len(rows), 1, "No containers found in the status table.")

            # Example: Check if a specific container is running
            container_name = "my-container"  # Replace with the name of your container
            container_status = None
            for row in rows:
                cells = row.find_elements(By.TAG_NAME, "td")
                if cells and cells[0].text == container_name:  # Assuming the first column contains container names
                    container_status = cells[1].text  # Assuming the second column contains the status
                    break

            self.assertIsNotNone(container_status, f"Container '{container_name}' not found.")
            self.assertEqual(container_status.lower(), "running", f"Container '{container_name}' is not running.")

        except Exception as e:
            self.fail(f"Test failed due to an exception: {e}")

    def test_container_creation_and_loading(self):
        driver = self.driver

        try:
            # Wait for the container status table to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "container-status-table"))  # Replace with the actual ID or selector
            )

            # Locate the container status table
            table = driver.find_element(By.ID, "container-status-table")  # Replace with the actual ID or selector

            # Verify the table contains at least one container
            rows = table.find_elements(By.TAG_NAME, "tr")
            if len(rows) > 1:  # Assuming the first row is a header
                print("SUCCESS: Docker containers were created and loaded successfully.")
            else:
                print("ERROR: No Docker containers found in the status table.")
                self.fail("No Docker containers found in the status table.")

        except Exception as e:
            print(f"ERROR: Test failed due to an exception: {e}")
            self.fail(f"Test failed due to an exception: {e}")

    def tearDown(self):
        # Close the browser window
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()