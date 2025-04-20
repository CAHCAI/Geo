from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class APIGenerateTest:
    def __init__(self):
        #load the driver (please uncomment the ones you would like to test and comment out the current one)

        #--------------Chrome-------------------
        # self.service = Service(executable_path="chromedriver.exe")
        self.service = Service()
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

    def loginforapi(self, username, password):
        try:
            self.driver.get("http://localhost:5173/")
            self.driver.maximize_window()
            time.sleep(2)

            #Open sidebar (login panel)
            sidebar_toggle = self.driver.find_element(By.XPATH, '//button[@aria-controls="radix-:r3:" and @type="button"]')
            sidebar_toggle.click()
            time.sleep(2)

            #Fill in login form
            username_field = self.driver.find_element(By.ID, "username")
            password_field = self.driver.find_element(By.ID, "password")
            login_button = self.driver.find_element(By.XPATH, '//button[@type="submit"]')

            username_field.send_keys(username)
            password_field.send_keys(password)
            login_button.click()
            print("✅ Successfully logged in.")
            time.sleep(2)

            #Click on body to exit logged in page
            body_click = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]'))
            )
            body_click.click()
            print("✅ Clicked on body to proceed.")

            #Check for login alert
            try:
                WebDriverWait(self.driver, 4).until(EC.alert_is_present())
                alert = self.driver.switch_to.alert
                alert_text = alert.text
                if "Change your password" in alert_text:
                    print("-----Results =======> Valid credentials [PASSED]")
                    alert.accept()
                else:
                    print("-----Results =======> Invalid credentials [FAILED]")
            except:
                print("✅ No alerts detected.")

        except Exception as e:
            print(f"❌ Error during login: {e}")

    def test_generate_api_key(self):
        try:
            driver = self.driver
            app_name = "Selenium Test"

            #Click Admin Dashboard
            print("➡️ Navigating to Admin Dashboard...")
            admin_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="root"]/html/body/main/div/nav/div[4]/div/div/button[6]'))
            )
            admin_button.click()
            time.sleep(2)

            #Scroll to App Name input
            print("➡️ Scrolling to App Name input...")
            app_name_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="admin-dashboard"]/section[5]/div/input'))
            )
            driver.execute_script("arguments[0].scrollIntoView(true);", app_name_input)
            time.sleep(1)

            #Input name
            app_name_input.clear()
            app_name_input.send_keys(app_name)
            time.sleep(1)  # Wait a moment to allow DOM update (can also use WebDriverWait)

            #Now check if the text is really there
            app_name = app_name_input.get_attribute("value")

            #Make sure to replace this with what ever you put -> app_name = "Selenium test"
            if app_name == "Selenium Test":
                print("➡️ Inputting app name...")
            else:
                print("❌ No App name was detected. Stopping test.")
                self.driver.quit()
                exit()  


            print("➡️ Clicking Generate...")
            generate_button = driver.find_element(By.XPATH, '//*[@id="admin-dashboard"]/section[5]/div/button')
            generate_button.click()
            time.sleep(2)

            print("✅ API Key generation triggered. Verifying table entry...")
            self.driver.save_screenshot("api_key_verification.png")

            #Check if app name appears in the table
            table_cell = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, f'//td[contains(text(), "{app_name}")]'))
            )

            if table_cell:
                #Print entire row text
                table_row = table_cell.find_element(By.XPATH, './ancestor::tr')
                print(f"✅ API key entry for '{app_name}' found. [PASSED]")
                print("📄 Newly Generated API Key:", table_row.text)
            else:
                print(f"❌ API key entry for '{app_name}' NOT found. [FAILED]")

        except Exception as e:
            print(f"Error during API key verification: {e}")
            self.driver.save_screenshot("api_key_verification_error.png")

    def close(self):
        self.driver.quit()


# Run the tests 
if __name__ == "__main__":
    test = APIGenerateTest()

    #Login - put in a valid username and password
    test.loginforapi("prithishapanta", "seleniumtest") 

    test.test_generate_api_key()

    test.close()
