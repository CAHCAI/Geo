import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

class APIGenerateTest:
    def __init__(self):
        
        #use these only for google chrome to get rid of the password manager popups
        #--------------------------------------------------------------------------
        chrome_opts = Options()

        # ---- keep Chrome from showing any credential bubbles -------------
        prefs = {
            # completely switch off the password‑manager services
            "credentials_enable_service": False,
            "profile.password_manager_enabled": False,
        }
        chrome_opts.add_experimental_option("prefs", prefs)

        # (optional) incognito so the profile is always “fresh”
        chrome_opts.add_argument("--incognito")

        # (optional) block the new UI‑based password features as well
        chrome_opts.add_argument("--disable-features=PasswordManagerEnableAutoSignIn,PasswordManagerRedesign,PasswordCheck")

        self.driver = webdriver.Chrome(options=chrome_opts)
        #--------------------------------------------------------------------------

        #load the driver (please uncomment the ones you would like to test and comment out the current one)
        #--------------Chrome-------------------
        # self.service = Service(executable_path="chromedriver.exe")
        # self.service = Service()
        #---------------Microsoft edge-----------
        # self.service = Service(executable_path="msedgedriver.exe")
        #---------------Mozilla firefox--------------
        # self.service = Service(executable_path="geckodriver.exe")
        #--------use google chrome driver--------------
        # self.driver = webdriver.Chrome(service=self.service)
        #-------------use firefox driver----------------
        #self.driver = webdriver.Firefox(service=self.service)
        #--------------use edge driver------------------
        # self.driver = webdriver.Edge(service=self.service)


    def adminLogin(self, username, password, testRun):
        try:
            self.driver.get("http://localhost:5173/")
            self.driver.maximize_window()
            time.sleep(2)

            #Open the sidebar (login panel)
            sidebar_toggle = self.driver.find_element(By.XPATH, '//button[@aria-controls="radix-:r3:" and @type="button"]')
            sidebar_toggle.click()
            time.sleep(2)

            #Fill in login credentials
            username_field = self.driver.find_element(By.ID, "username")
            password_field = self.driver.find_element(By.ID, "password")
            login_button = self.driver.find_element(By.XPATH, '//button[@type="submit"]')

            username_field.send_keys(username)
            password_field.send_keys(password)
            login_button.click()
            print("✅ Attempt to log in.")
            time.sleep(2)

            if testRun:
                return
            
            else:
                #Click anywhere on screen to exit overlay
                body_click = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]'))
                )
                body_click.click()
                print("✅ Clicked on body to proceed.")

                #Check for login success alert
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
            print(f"------Error ========> Error occurred during login: {e}")


    def testErrors(self):
        try:
            driver = self.driver

            #Click Admin Dashboard button
            print("✅ Navigated to Admin Dashboard...")
            admin_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="root"]/html/body/main/div/nav/div[4]/div/div/button[6]'))
            )
            admin_button.click()
            time.sleep(2)

            print(" \n----------Test 1 : Invalid user login-------------")
            self.loginError("pp")
            print(" \n----------Test 2 : Invalid Coordinate Override Upload-------------")
            self.cordError(driver, file="test.xlsx")
            self.getCordError()
            print(" \n----------Test 3 : Invalid Shapefile Upload-------------")
            self.errorTriggers(driver, file="ad.zip", EXPECTED_MSG = "Invalid selected shapefile type.")
            print(" \n----------Test 4 : No shapefile in the zip-------------")
            self.errorTriggers(driver, file="noshapes.zip", EXPECTED_MSG = "No shapefile found in the .zip archive.")
            print(" \n----------Test 5 : No app name for the API Key generation-------------")
            self.apiKeyTest()
            

        except Exception as e:
            print(f"Error occured while testing the admin errors: {e}")
    
    def loginError(self, username):
        driver = self.driver
        ERROR_CELL = (By.XPATH, "//*[@id='admin-dashboard']/section[2]/div[2]/table/tbody/tr[1]/td[3]")
        EXPECTED_MSG = f"Invalid credentials provided during login by {username}"

        try:
            WebDriverWait(driver, 10).until(
                EC.text_to_be_present_in_element(ERROR_CELL, EXPECTED_MSG)
            )
            print(f"✅ Error logged: {EXPECTED_MSG}")
            print("✅✅✅Test Passed")
        except Exception as e:
            print("")


    def errorTriggers(self, driver, file, EXPECTED_MSG):
        file_path = os.path.abspath(file)

        # wait until the file‑input appears in the DOM
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
        )
        print(f"✅ Chose {file} for Senate upload")
        # triggers the upload
        file_input.send_keys(file_path)      
        upload_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="admin-dashboard"]/section[4]/div/button'))
            )
        print(f"✅ Uploading {file}")
        # click the upload button
        upload_button.click()  
        time.sleep(10)

        ERROR_CELL = (By.XPATH, "//*[@id='admin-dashboard']/section[2]/div[2]/table/tbody/tr[1]/td[3]")

        try:
            WebDriverWait(driver, 10).until(
                EC.text_to_be_present_in_element(ERROR_CELL, EXPECTED_MSG)
            )
            print(f"✅ Error logged: {EXPECTED_MSG}")
            print("✅✅✅Test Passed")
        except Exception as e:
            print(f"❌Test Failed")


    def cordError(self, driver, file):
        try:
            driver = self.driver

            #Click Coordinate Override button
            print("✅ Navigated to Coordinate Override")
            cord_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="root"]/html/body/main/div/nav/div[4]/div/div/button[7]'))
            )
            cord_button.click()
            time.sleep(2)

            file_path = os.path.abspath(file)

            # wait until the file‑input appears in the DOM
            file_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
            )
            print(f"✅ Chose {file} for XLSX upload")

            # triggers the upload
            file_input.send_keys(file_path)      
            upload_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="root"]/html/body/main/div/main/div/section[1]/div/button'))
                )
            print(f"✅ Uploading {file}")
            # click the upload button
            upload_button.click()  
            time.sleep(3)

            alert = driver.switch_to.alert
            alert.accept()
            print("✅ Alert accepted.")
            admin_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="root"]/html/body/main/div/nav/div[4]/div/div/button[6]'))
            )
            admin_button.click()
            time.sleep(2)
            print("✅ Leaving Coordinate Override and Entering Admin Dashbaord.")

        except Exception as e:
            print(f"❌Test Failed")

    def getCordError(self):
        try:
            driver = self.driver
            ERROR_CELL = (By.XPATH, "//*[@id='admin-dashboard']/section[2]/div[2]/table/tbody/tr[1]/td[3]")
            EXPECTED_MSG = "No valid rows found in XLSX."

            try:
                WebDriverWait(driver, 10).until(
                    EC.text_to_be_present_in_element(ERROR_CELL, EXPECTED_MSG)
                )
                print(f"✅ Error logged: {EXPECTED_MSG}")

                print("✅✅✅Test Passed")

            except Exception as e:
                print(f"❌Test Failed")
        except Exception as e:
                print(f"❌Test Failed")

       
    def apiKeyTest(self):
        try:
            driver = self.driver

            #Scroll to App Name input
            print("✅ Scrolling to App Name input")
            app_name_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="admin-dashboard"]/section[5]/div/input'))
            )
            driver.execute_script("arguments[0].scrollIntoView(true);", app_name_input)
            time.sleep(2)

            #Click Generate button
            print("✅ Clicking Generate...")
            generate_button = driver.find_element(By.XPATH, '//*[@id="admin-dashboard"]/section[5]/div/button')
            generate_button.click()
            time.sleep(2)

            ERROR_CELL = (By.XPATH, "//*[@id='admin-dashboard']/section[2]/div[2]/table/tbody/tr[1]/td[3]")
            EXPECTED_MSG = "App name is required when generating API key"

            try:
                WebDriverWait(driver, 10).until(
                    EC.text_to_be_present_in_element(ERROR_CELL, EXPECTED_MSG)
                )
                print(f"✅ Error logged: {EXPECTED_MSG}")

                print("✅✅✅Test Passed")

            except Exception as e:
                print(f"❌Test Failed")
    
        except Exception as e:
            print(f"Error during API key generation: {e}")
            print(f"❌Test Failed")

    def close(self):
        self.driver.quit()

#Run the test
if __name__ == "__main__":
    test = APIGenerateTest()

    #invalid login error
    test.adminLogin("pp", "12", True)
    #test this invalid login error
    test.loginError("pp") 

    #valid login
    test.adminLogin("pp", "1234", False) 

    test.testErrors()

    test.close()
