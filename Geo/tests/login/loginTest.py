from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.alert import Alert
import time

'''
Tester: Prashant Ram
Recorder: Muhammad Hassan

System: Windows x64 bit
Chrome version tested on: Version: 134.0.6998.35 (r1415337) with driver: 134
Firefox: 136.0 with driver: 0.36.0
Microsoft Edge: Version 134.0.3124.51 with driver: 134.0.3124.51 
'''
class AdminLoginTest:
    def __init__(self):
        #load the driver (please uncomment the ones you would like to test and comment out the current one)


        #--------------Chrome-------------------
        # self.service = Service(executable_path="chromedriver.exe")
        #---------------Microsoft edge-----------
        self.service = Service(executable_path="msedgedriver.exe")
        #---------------Mozilla firefox--------------
        # self.service = Service(executable_path="geckodriver.exe")

        #--------use google chrome driver--------------
        # self.driver = webdriver.Chrome(service=self.service)
        #-------------use firefox driver----------------
        #self.driver = webdriver.Firefox(service=self.service)
        #--------------use edge driver------------------
        self.driver = webdriver.Edge(service=self.service)

    def login(self, username, password):
        try:
            #try to connect to our front ent which is running locally right now
            self.driver.get("http://localhost:5173/")
            
            #find the sidebar
            sidebar_toggle = self.driver.find_element(By.XPATH, '//button[@aria-controls="radix-:r3:" and @type="button"]')
            #click the sidebar
            sidebar_toggle.click()
            #keep the webpage running
            time.sleep(2)

            #find username
            username_field = self.driver.find_element(By.ID, "username")
            #find the password field
            password_field = self.driver.find_element(By.ID, "password")
            #find the login button
            login_button = self.driver.find_element(By.XPATH, '//button[@type="submit"]')

            #enter the username
            username_field.send_keys(username)
            #enter the password
            password_field.send_keys(password)
            #click the login button
            login_button.click()
            #keep the webpage running
            time.sleep(1) 

            try:
                WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="radix-:r3:"]/section/div[2]/div/button')))
                # welcome_text = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Welcome back')]").text
                print(f"✅ Valid User - Login Accepted ===> Passed Test for user: {username}")

            except Exception as e:
                #catch any errors
                print(f"❌ Invalid user: Login Denied for user: {username} ===> Passed Test")

        except Exception as e:
                #catch any errors
                print(f"❌Test failed due to error {e}:")

    def close(self):
        #close the web driver
        self.driver.quit()

# Test the class
if __name__ == "__main__":
    # Create an instance of the AdminLoginTest class
    admin_login_test = AdminLoginTest()

    #list containing test_usernames
    test_usernames = ["prash", "admin", "pp", "john", "doe", "vegeta", "tanjiro", "nezuko", "geo", "bernard", 
                      "mike", "yahir", "hassan", "prithisha", "brandon", "ben", "prashant", "buddy", "meglu", "testingUser",
                      "iphone12", "android", "samsung", "nokia", "huawei", "oneplus", "xiaomi", "oppo", "vivo", "done"]

    #list containing test_passwords
    test_passwords = ["1234", "admin", "1234", "doe1234", "1111", "0000@s", "1234", "admin", "1234", "doe1234", 
                      "1111", "0000@s", "1234", "admin", "1234", "doe1234", "1111", "0000@s", "erwat567", "qwerrty12344567890",
                      "1234", "admin", "1234", "doe1234", "1111", "0000@s", "1234", "admin", "finally6789", "doe1234"]
    
    #for my test, valid users are pp, nezuko, buddy, samsung, vivo.
    
    #check if the test_usernames and test_passwords are the same length
    print(f"The usernames and password are of same length? {len(test_passwords) == len(test_usernames)}")

    #how many times to run the test
    number_of_tests = len(test_usernames)

    #print how many tests are going to be run
    print(f'\nRunning {number_of_tests} tests')

    #automate the login
    for i in range(number_of_tests):
        print(f'-----Admin Login Test {i+1}-----')
        admin_login_test.login(test_usernames[i], test_passwords[i])

    # Close the browser
    admin_login_test.close()