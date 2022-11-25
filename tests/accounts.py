from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from pathlib import Path
import unittest
import time

class testemptylogin(unittest.TestCase):
    def test_empty_login(self):
        driver = webdriver.Chrome()
        driver.get('http://127.0.0.1:5500/login.html')
        login = driver.find_element(By.ID, "login")
        login.click()
        self.assertEqual(str(driver.current_url), 'http://127.0.0.1:5500/login.html')
        driver.quit()

class testemptypassword(unittest.TestCase):
    def test_empty_password(self):
        driver = webdriver.Chrome()
        driver.get('http://127.0.0.1:5500/login.html')
        email = driver.find_element(By.ID, "email")
        email.send_keys("test@test.com")
        login = driver.find_element(By.ID, "login")
        login.click()
        self.assertEqual(str(driver.current_url), 'http://127.0.0.1:5500/login.html')
        driver.quit()

class testemptyemail(unittest.TestCase):
    def test_empty_email(self):
        driver = webdriver.Chrome()
        driver.get('http://127.0.0.1:5500/login.html')
        driver.get('http://127.0.0.1:5500/login.html')
        password = driver.find_element(By.ID, "password")
        password.send_keys("12345678")
        login = driver.find_element(By.ID, "login")
        login.click()
        self.assertEqual(str(driver.current_url), 'http://127.0.0.1:5500/login.html')
        driver.quit()

class testmalformedemail(unittest.TestCase):
    def test_malformed_email(self):
        driver = webdriver.Chrome()
        driver.get('http://127.0.0.1:5500/login.html')
        driver.get('http://127.0.0.1:5500/login.html')
        email = driver.find_element(By.ID, "email")
        email.send_keys("testtest.com")
        password = driver.find_element(By.ID, "password")
        password.send_keys("12345678")
        login = driver.find_element(By.ID, "login")
        login.click()
        self.assertEqual(str(driver.current_url), 'http://127.0.0.1:5500/login.html')
        driver.quit()

class testmalformedpassword(unittest.TestCase):
    def test_malformed_password(self):
        driver = webdriver.Chrome()
        driver.get('http://127.0.0.1:5500/login.html')
        driver.get('http://127.0.0.1:5500/login.html')
        email = driver.find_element(By.ID, "email")
        email.send_keys("test@test.com")
        password = driver.find_element(By.ID, "password")
        password.send_keys("1234")
        login = driver.find_element(By.ID, "login")
        login.click()
        self.assertEqual(str(driver.current_url), 'http://127.0.0.1:5500/login.html')
        driver.quit()

class testfail(unittest.TestCase):
    def test_failure(self):
        driver = webdriver.Chrome()
        driver.get('http://127.0.0.1:5500/login.html')
        driver.get('http://127.0.0.1:5500/login.html')
        email = driver.find_element(By.ID, "email")
        email.send_keys("fake@nope.com")
        password = driver.find_element(By.ID, "password")
        password.send_keys("12345678")
        login = driver.find_element(By.ID, "login")
        login.click()
        time.sleep(3)
        self.assertEqual(str(driver.current_url), 'http://127.0.0.1:5500/login.html')
        driver.quit()

class testsuccess(unittest.TestCase):
    def test_success(self):
        driver = webdriver.Chrome()
        driver.get('http://127.0.0.1:5500/login.html')
        driver.get('http://127.0.0.1:5500/login.html')
        email = driver.find_element(By.ID, "email")
        email.send_keys("test@test.com")
        password = driver.find_element(By.ID, "password")
        password.send_keys("12345678")
        login = driver.find_element(By.ID, "login")
        login.click()
        time.sleep(3)
        self.assertEqual(str(driver.current_url), 'http://127.0.0.1:5500/home.html')
        driver.quit()

unittest.main()