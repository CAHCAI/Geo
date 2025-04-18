from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

import time
import os

class ManualOverrideCRUDTest:
    def __init__(self):
        self.service = Service(executable_path="msedgedriver.exe")
        self.driver = webdriver.Edge(service=self.service)
        self.wait = WebDriverWait(self.driver, 10)

    def login_and_navigate(self, username, password):
        self.driver.get("http://localhost:5173/")
        #find the sidebar
        sidebar_toggle = self.driver.find_element(By.XPATH, '//button[@aria-controls="radix-:r3:" and @type="button"]')
        #click the sidebar
        sidebar_toggle.click()
        #keep the webpage running
        time.sleep(2)
        # Login
        self.driver.find_element(By.ID, "username").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.XPATH, '//button[@type="submit"]').click()

        # Accept alert
        try:
            self.wait.until(EC.alert_is_present()).accept()
        except:
            pass

        time.sleep(2)

        # Click sidebar X to close popup
        for btn in self.driver.find_elements(By.TAG_NAME, "button"):
            print(btn.get_attribute("outerHTML"))
            
        self.driver.find_element(By.CSS_SELECTOR, 'div[id^="radix"] > button').click()
        time.sleep(1)

        # Click on "Manual Overrides" nav
        self.driver.find_element(By.XPATH, "/html/body/div/html/body/main/div/nav/div[4]/div/div/button[7]").click()
        time.sleep(2)

    def create_override(self, coord_text, address_text="1234Test"):
        # Enter coordinates in the first input
        coord_input = self.driver.find_element(By.XPATH, "/html/body/div/html/body/main/div/main/div/section[2]/input[1]")
        coord_input.clear()
        coord_input.send_keys(coord_text)
        time.sleep(1)

        # Wait for the second input to appear
        addr_input = WebDriverWait(self.driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div/html/body/main/div/main/div/section[2]/input[2]"))
        )
        addr_input.clear()
        addr_input.send_keys(address_text)
        time.sleep(1)

        # Click the submit button
        submit_btn = self.driver.find_element(By.XPATH, "/html/body/div/html/body/main/div/main/div/section[2]/button")
        submit_btn.click()
        time.sleep(2)

    def update_first_override(self, new_text, lat, long):
        edit_buttons = self.driver.find_elements(By.XPATH, '//button[text()="Edit"]')
        if edit_buttons:
            edit_buttons[0].click()
            input_field = self.driver.find_element(By.XPATH, "/html/body/div[2]/div/div/div/div/div/div/input[1]")
            input_field.clear()
            input_field.send_keys(new_text)
            
            time.sleep(2)
            
            input_field_2 = self.driver.find_element(By.XPATH, "/html/body/div[2]/div/div/div/div/div/div/input[2]")
            input_field_2.clear()
            input_field_2.send_keys(lat)
            
            time.sleep(2)
            
            input_field_3 = self.driver.find_element(By.XPATH, "/html/body/div[2]/div/div/div/div/div/div/input[3]")
            input_field_3.clear()
            input_field_3.send_keys(long)
            
            time.sleep(2)
            
            submit_button = self.driver.find_element(By.XPATH, "/html/body/div[2]/div/div/div/div/div/button[2]")
            submit_button.click()
            
            time.sleep(2)
            

    def delete_last_override(self):
        # Click the last Delete button
        delete_buttons = self.driver.find_elements(By.XPATH, '//button[text()="Delete"]')
        if delete_buttons:
            delete_buttons[0].click()
            time.sleep(1)

            # Wait for and confirm the delete in the modal
            confirm_button = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "/html/body/div[2]/div/div/div/div/div/div/button[2]"))
            )
            confirm_button.click()
            time.sleep(2)


    def close(self):
        self.driver.quit()

    def upload_excel_file(self, filename):
        # Resolve full file path
        file_path = os.path.abspath(filename)

        # Upload to the hidden input
        upload_input = self.driver.find_element(By.ID, "file-upload")
        upload_input.send_keys(file_path)
        time.sleep(1)

        # Click the upload button once it's enabled
        upload_button = WebDriverWait(self.driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Upload File") and not(@disabled)]'))
        )
        upload_button.click()

        # Wait for JS alert and accept it
        try:
            alert = WebDriverWait(self.driver, 5).until(EC.alert_is_present())
            print(f"Alert message: {alert.text}")
            alert.accept()
            print("Upload confirmed via alert.")
        except TimeoutException:
            print("No alert appeared after upload.")

        time.sleep(2)
        
# Run the full test
if __name__ == "__main__":
    test = ManualOverrideCRUDTest()
    test.login_and_navigate("mike", "mike")
    
    print("Creating a new override...")
    test.create_override("1.1, 2.2")

    print("Editing the first override...")
    test.update_first_override("EditedTest","2.2","3.3")

    print("Deleting the last override...")
    test.delete_last_override()
    
    print("Uploading Excels...")
    test.upload_excel_file("test.xlsx")

    print("All Tests Passed :)")
    time.sleep(10)

    test.close()
